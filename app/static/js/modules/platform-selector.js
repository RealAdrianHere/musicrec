const PlatformSelector = {
    selectedPlatform: null,
    listeners: [],
    currentSongInfo: null,

    init() {
        this.loadSelectedPlatform();
        this.bindEvents();
        this.updateUI();
    },

    loadSelectedPlatform() {
        const savedPlatform = localStorage.getItem(Config.STORAGE_KEYS.SELECTED_PLATFORM);
        this.selectedPlatform = savedPlatform || Config.DEFAULT_PLATFORM;
        console.log('PlatformSelector - Loaded platform:', this.selectedPlatform);
    },

    saveSelectedPlatform(platform) {
        localStorage.setItem(Config.STORAGE_KEYS.SELECTED_PLATFORM, platform);
        this.selectedPlatform = platform;
        console.log('PlatformSelector - Saved platform:', this.selectedPlatform);
        this.updateUI();
        this.notifyListeners();
    },

    addListener(callback) {
        this.listeners.push(callback);
    },

    removeListener(callback) {
        this.listeners = this.listeners.filter(listener => listener !== callback);
    },

    notifyListeners() {
        this.listeners.forEach(callback => {
            try {
                callback(this.selectedPlatform);
            } catch (error) {
                console.error('Error in platform change listener:', error);
            }
        });
    },

    getSelectedPlatform() {
        return this.selectedPlatform;
    },

    getPlatformInfo(platformKey) {
        return Config.MUSIC_PLATFORMS[platformKey] || null;
    },

    getPlatformConfig(platformKey) {
        return this.getPlatformInfo(platformKey);
    },

    setCurrentSongInfo(songName, singer) {
        this.currentSongInfo = { songName, singer };
        console.log('PlatformSelector - Set current song:', this.currentSongInfo);
    },

    getCurrentSongInfo() {
        return this.currentSongInfo;
    },

    jumpToPlatform(platformKey = null) {
        const targetPlatform = platformKey || this.selectedPlatform;
        const platform = this.getPlatformInfo(targetPlatform);
        
        if (!platform) {
            console.error('PlatformSelector - Platform not found:', targetPlatform);
            return;
        }

        if (!this.currentSongInfo) {
            console.warn('PlatformSelector - No current song info, jumping to platform home');
            window.open(platform.searchUrl, '_blank');
            return;
        }

        const { songName, singer } = this.currentSongInfo;
        const searchUrl = `${platform.searchUrl}${encodeURIComponent(songName + ' ' + singer)}`;
        
        console.log('PlatformSelector - Jumping to:', searchUrl);
        window.open(searchUrl, '_blank');
    },

    jumpToAllPlatforms() {
        if (!this.currentSongInfo) {
            console.warn('PlatformSelector - No current song info');
            return;
        }

        const { songName, singer } = this.currentSongInfo;
        const platforms = Object.values(Config.MUSIC_PLATFORMS);
        
        platforms.forEach((platform, index) => {
            setTimeout(() => {
                const searchUrl = `${platform.playerUrl}?search=${encodeURIComponent(songName + ' ' + singer)}`;
                window.open(searchUrl, '_blank');
            }, index * 500);
        });
    },

    bindEvents() {
        const platformToggle = document.getElementById('platform-toggle');
        const platformDropdown = document.getElementById('platform-dropdown');
        const jumpBtn = document.getElementById('jump-btn');
        const platformOptions = document.querySelectorAll('.platform-option');

        if (!platformToggle || !platformDropdown) {
            console.warn('PlatformSelector - Platform selector elements not found');
            return;
        }

        platformToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            platformDropdown.classList.toggle('show');
            platformToggle.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!platformDropdown.contains(e.target) && !platformToggle.contains(e.target)) {
                platformDropdown.classList.remove('show');
                platformToggle.classList.remove('active');
            }
        });

        platformOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const platformKey = option.dataset.platform;
                const platformName = option.dataset.name;
                const platformIcon = option.dataset.icon;
                
                this.saveSelectedPlatform(platformKey);
                
                platformDropdown.classList.remove('show');
                platformToggle.classList.remove('active');
                
                this.showNotification(`已切换到 ${platformName}`);
            });
        });

        if (jumpBtn) {
            jumpBtn.addEventListener('click', () => {
                this.jumpToPlatform();
            });
        }
    },

    updateUI() {
        const platformToggle = document.getElementById('platform-toggle');
        const platformOptions = document.querySelectorAll('.platform-option');
        
        if (!platformToggle) return;

        const platform = this.getPlatformInfo(this.selectedPlatform);
        if (!platform) return;

        const iconElement = platformToggle.querySelector('.platform-current-icon');
        const nameElement = platformToggle.querySelector('.platform-current-name');
        
        if (iconElement) iconElement.textContent = platform.icon;
        if (nameElement) nameElement.textContent = platform.name;

        platformOptions.forEach(option => {
            const platformKey = option.dataset.platform;
            if (platformKey === this.selectedPlatform) {
                option.classList.add('selected');
            } else {
                option.classList.remove('selected');
            }
        });
    },

    showNotification(message) {
        const existingNotification = document.querySelector('.platform-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = 'platform-notification';
        notification.innerHTML = `
            <span class="notification-icon">✓</span>
            <span class="notification-text">${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2000);
    },

    refreshAllCards() {
        const resultCards = document.querySelectorAll('.result-card');
        resultCards.forEach(card => {
            const platformTag = card.querySelector('.platform-tag');
            if (platformTag) {
                const platform = this.getPlatformInfo(this.selectedPlatform);
                if (platform) {
                    platformTag.textContent = platform.name;
                }
            }
        });
    },

    generateSearchUrl(songName, singer) {
        const platform = this.getPlatformInfo(this.selectedPlatform);
        if (!platform) {
            console.error('PlatformSelector - Platform not found:', this.selectedPlatform);
            return '#';
        }
        
        const searchQuery = encodeURIComponent(songName + ' ' + singer);
        
        if (this.selectedPlatform === 'APPLE') {
            return `${platform.searchUrl}?term=${searchQuery}`;
        }
        
        return `${platform.searchUrl}${searchQuery}`;
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = PlatformSelector;
}