const PlatformSelector = {
    selectedPlatform: null,
    listeners: [],

    init() {
        this.loadSelectedPlatform();
        this.createPlatformSelector();
        this.bindEvents();
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

    createPlatformSelector() {
        const navbar = document.querySelector('.navbar-container');
        if (!navbar) return;

        const selectorContainer = document.createElement('div');
        selectorContainer.className = 'platform-selector';
        selectorContainer.innerHTML = `
            <div class="platform-selector-label">跳转平台</div>
            <div class="platform-buttons">
                <button class="platform-btn ${this.selectedPlatform === 'NETEASE' ? 'active' : ''}" 
                        data-platform="NETEASE" 
                        title="网易云音乐">
                    <span class="platform-icon">${Config.MUSIC_PLATFORMS.NETEASE.icon}</span>
                    <span class="platform-name">${Config.MUSIC_PLATFORMS.NETEASE.name}</span>
                </button>
                <button class="platform-btn ${this.selectedPlatform === 'QQ' ? 'active' : ''}" 
                        data-platform="QQ" 
                        title="QQ音乐">
                    <span class="platform-icon">${Config.MUSIC_PLATFORMS.QQ.icon}</span>
                    <span class="platform-name">${Config.MUSIC_PLATFORMS.QQ.name}</span>
                </button>
            </div>
        `;

        navbar.appendChild(selectorContainer);
    },

    bindEvents() {
        const platformBtns = document.querySelectorAll('.platform-btn');
        platformBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.handlePlatformChange(e, btn));
        });
    },

    handlePlatformChange(event, btn) {
        const platform = btn.getAttribute('data-platform');
        
        if (platform === this.selectedPlatform) {
            console.log('PlatformSelector - Platform already selected:', platform);
            return;
        }

        console.log('PlatformSelector - Changing platform from', this.selectedPlatform, 'to', platform);
        this.saveSelectedPlatform(platform);
        this.updateActiveButton(btn);
        
        Notification.show(
            `已切换到${Config.MUSIC_PLATFORMS[platform].name}`,
            Constants.NOTIFICATION_TYPES.INFO
        );
    },

    updateActiveButton(activeBtn) {
        const platformBtns = document.querySelectorAll('.platform-btn');
        platformBtns.forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');
    },

    getSelectedPlatform() {
        return this.selectedPlatform;
    },

    getPlatformConfig(platform) {
        return Config.MUSIC_PLATFORMS[platform] || Config.MUSIC_PLATFORMS[Config.DEFAULT_PLATFORM];
    },

    generateSearchUrl(songName, singerName) {
        const platform = this.getPlatformConfig(this.selectedPlatform);
        const searchQuery = encodeURIComponent(`${songName} ${singerName}`);
        const url = `${platform.searchUrl}${searchQuery}`;
        console.log('PlatformSelector - Generated URL:', url, 'for platform:', this.selectedPlatform);
        return url;
    },

    refreshAllCards() {
        const songLinks = document.querySelectorAll('.song-link');
        console.log('PlatformSelector - Refreshing', songLinks.length, 'cards');
        
        songLinks.forEach(link => {
            const card = link.closest('.result-card');
            if (!card) return;

            const songTitle = card.querySelector('.song-title');
            const singerName = card.querySelector('.singer-name');
            
            if (songTitle && singerName) {
                const songName = songTitle.textContent;
                const singerText = singerName.textContent.replace('🎤 ', '');
                const newUrl = this.generateSearchUrl(songName, singerText);
                
                link.href = newUrl;
                link.title = `在${Config.MUSIC_PLATFORMS[this.selectedPlatform].name}中搜索：${songName} - ${singerText}`;
                
                const platformIndicator = card.querySelector('.platform-indicator');
                if (platformIndicator) {
                    const platformConfig = this.getPlatformConfig(this.selectedPlatform);
                    platformIndicator.innerHTML = `${platformConfig.icon} ${platformConfig.name}`;
                    platformIndicator.style.color = platformConfig.color;
                }
            }
        });
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = PlatformSelector;
}
