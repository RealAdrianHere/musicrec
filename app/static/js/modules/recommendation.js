const Recommendation = {
    cache: new Map(),
    cacheSize: Config.CACHE.SIZE,

    init() {
        this.textInput = document.getElementById('text-input');
        this.submitBtn = document.getElementById('submit-btn');
        this.resultsContainer = document.getElementById('results');
        this.loadingElement = document.getElementById('loading');
        this.charCountElement = document.getElementById('char-count');
        
        this.bindEvents();
        this.registerPlatformListener();
    },

    registerPlatformListener() {
        PlatformSelector.addListener((platform) => {
            console.log('Recommendation - Platform changed to:', platform);
            PlatformSelector.refreshAllCards();
        });
    },

    bindEvents() {
        if (this.submitBtn) {
            this.submitBtn.addEventListener('click', () => this.submitForm());
        }

        if (this.textInput) {
            this.textInput.addEventListener('input', () => this.handleInput());
            this.textInput.addEventListener('keydown', (e) => this.handleKeyDown(e));
        }
    },

    handleInput() {
        const count = this.textInput.value.length;
        const max = Config.LIMITS.MAX_TEXT_LENGTH;
        
        if (this.charCountElement) {
            this.charCountElement.textContent = `${count}/${max}`;
            
            if (count > max) {
                this.charCountElement.style.color = Constants.NOTIFICATION_COLORS.error;
                this.textInput.value = this.textInput.value.substring(0, max);
                this.charCountElement.textContent = `${max}/${max}`;
            } else {
                this.charCountElement.style.color = '';
            }
        }
    },

    handleKeyDown(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.submitForm();
        }
    },

    async submitForm() {
        const text = this.textInput.value.trim();

        if (!text) {
            Notification.show(Constants.ERROR_MESSAGES.EMPTY_INPUT, Constants.NOTIFICATION_TYPES.ERROR);
            this.textInput.focus();
            return;
        }

        this.setLoading(true);

        try {
            const recommendations = await this.fetchRecommendations(text);
            this.displayResults(recommendations);
            
            if (recommendations.length > 0) {
                History.add(recommendations);
                Notification.show(
                    Constants.SUCCESS_MESSAGES.RECOMMENDATIONS_FOUND(recommendations.length),
                    Constants.NOTIFICATION_TYPES.SUCCESS
                );
                this.scrollToResults();
            } else {
                Notification.show(Constants.EMPTY_STATES.NO_RESULTS, Constants.NOTIFICATION_TYPES.INFO);
            }
        } catch (error) {
            console.error('Recommendation error:', error);
            Notification.show(Constants.ERROR_MESSAGES.NETWORK_ERROR, Constants.NOTIFICATION_TYPES.ERROR);
        } finally {
            this.setLoading(false);
        }
    },

    async fetchRecommendations(text, topN = Config.LIMITS.DEFAULT_RECOMMEND_COUNT) {
        const cacheKey = `${text}_${topN}`;
        
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        const response = await fetch(Config.ENDPOINTS.RECOMMEND, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: text,
                top_n: topN
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        if (!data.recommendations) {
            return [];
        }

        this.cache.set(cacheKey, data.recommendations);
        
        if (this.cache.size > this.cacheSize) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }

        return data.recommendations;
    },

    displayResults(recommendations) {
        console.log('Recommendation - Displaying results:', recommendations.length, 'songs');
        
        this.resultsContainer.innerHTML = '';

        if (recommendations.length === 0) {
            this.resultsContainer.innerHTML = `<p class="empty-state">${Constants.EMPTY_STATES.NO_RESULTS}</p>`;
            return;
        }

        const favorites = Favorites.getAll();

        recommendations.forEach((song, index) => {
            const card = this.createResultCard(song, index, favorites);
            this.resultsContainer.appendChild(card);
        });

        Favorites.bindEvents();
        
        console.log('Recommendation - Results displayed successfully');
    },

    createResultCard(song, index, favorites) {
        const similarity = Utils.formatSimilarity(song.similarity);
        const isFavorite = Favorites.isFavorite(song.name, song.singer);
        const searchUrl = PlatformSelector.generateSearchUrl(song.name, song.singer);
        const platformConfig = PlatformSelector.getPlatformConfig(PlatformSelector.getSelectedPlatform());
        
        console.log('Recommendation - Creating card for:', song.name, 'URL:', searchUrl, 'Platform:', platformConfig.name);

        const card = document.createElement('a');
        card.href = searchUrl;
        card.className = 'result-card clickable song-link';
        card.target = '_blank';
        card.rel = 'noopener noreferrer';
        card.title = `在${platformConfig.name}中搜索：${song.name} - ${song.singer}`;
        card.style.animationDelay = `${index * Config.ANIMATION.CARD_DELAY}ms`;

        card.innerHTML = `
            <div class="song-name">
                <span class="song-title">${Utils.escapeHtml(song.name)}</span>
                <button class="fav-btn ${isFavorite ? 'active' : ''}" 
                        data-song="${Utils.escapeHtml(song.name)}" 
                        data-singer="${Utils.escapeHtml(song.singer)}"
                        title="收藏歌曲">
                    ❤️
                </button>
            </div>
            <p class="singer-name">🎤 ${Utils.escapeHtml(song.singer)}</p>
            <p class="similarity-score">相似度: ${similarity}%</p>
            <div class="platform-indicator" style="color: ${platformConfig.color}">
                ${platformConfig.icon} ${platformConfig.name}
            </div>
        `;

        card.addEventListener('click', (e) => this.handleCardClick(e, song, searchUrl));

        return card;
    },

    handleCardClick(event, song, searchUrl) {
        if (event.target.classList.contains('fav-btn')) {
            event.stopPropagation();
            event.preventDefault();
            return;
        }

        const platform = PlatformSelector.getSelectedPlatform();
        const platformConfig = PlatformSelector.getPlatformConfig(platform);
        
        Notification.show(
            `正在跳转到${platformConfig.name}...`,
            Constants.NOTIFICATION_TYPES.INFO,
            1500
        );
    },

    setLoading(isLoading) {
        if (this.submitBtn) {
            this.submitBtn.disabled = isLoading;
            const btnText = this.submitBtn.querySelector('.btn-text');
            if (btnText) {
                btnText.textContent = isLoading ? '寻找中...' : '寻找共鸣';
            }
        }

        if (this.loadingElement) {
            if (isLoading) {
                this.loadingElement.classList.remove('hidden');
            } else {
                this.loadingElement.classList.add('hidden');
            }
        }

        if (isLoading) {
            this.resultsContainer.innerHTML = '';
        }
    },

    scrollToResults() {
        const resultsSection = document.querySelector('.results-section');
        if (resultsSection) {
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    },

    async fetchRandomSongs(count = 6) {
        try {
            const response = await fetch(`${Config.ENDPOINTS.RANDOM_RECOMMEND}?top_n=${count}`);
            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            return data.recommendations || [];
        } catch (error) {
            console.error('Random songs error:', error);
            return [];
        }
    },

    displayRandomSongs(songs) {
        const featuredGrid = document.querySelector('.featured-grid');
        
        if (!featuredGrid) return;

        if (songs.length === 0) {
            featuredGrid.innerHTML = `<p class="empty-state">${Constants.EMPTY_STATES.NO_FEATURED}</p>`;
            return;
        }

        const favorites = Favorites.getAll();

        featuredGrid.innerHTML = songs.map((song, index) => {
            const isFavorite = Favorites.isFavorite(song.name, song.singer);
            const searchUrl = PlatformSelector.generateSearchUrl(song.name, song.singer);
            const platformConfig = PlatformSelector.getPlatformConfig(PlatformSelector.getSelectedPlatform());
            
            return `
                <a href="${searchUrl}" 
                   class="result-card clickable song-link" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   style="animation-delay: ${index * Config.ANIMATION.CARD_DELAY}ms"
                   title="在${platformConfig.name}中搜索：${song.name} - ${song.singer}">
                    <div class="song-name">
                        <span class="song-title">${Utils.escapeHtml(song.name)}</span>
                        <button class="fav-btn ${isFavorite ? 'active' : ''}" 
                                data-song="${Utils.escapeHtml(song.name)}" 
                                data-singer="${Utils.escapeHtml(song.singer)}"
                                title="收藏歌曲">
                            ❤️
                        </button>
                    </div>
                    <p class="singer-name">🎤 ${Utils.escapeHtml(song.singer)}</p>
                    <p class="similarity-score">热门推荐</p>
                    <div class="platform-indicator" style="color: ${platformConfig.color}">
                        ${platformConfig.icon} ${platformConfig.name}
                    </div>
                </a>
            `;
        }).join('');

        Favorites.bindEvents();
    },

    clearCache() {
        this.cache.clear();
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Recommendation;
}
