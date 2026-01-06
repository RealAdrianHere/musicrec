const App = {
    init() {
        console.log('Echoes of Mood - Initializing...');

        this.initLocalStorage();
        this.initModules();
        this.initSmoothScroll();
        this.initAutoFocus();

        console.log('Echoes of Mood - Initialized successfully');
    },

    initLocalStorage() {
        if (!localStorage.getItem(Config.STORAGE_KEYS.MUSIC_HISTORY)) {
            localStorage.setItem(Config.STORAGE_KEYS.MUSIC_HISTORY, JSON.stringify([]));
        }

        if (!localStorage.getItem(Config.STORAGE_KEYS.FAVORITE_SONGS)) {
            localStorage.setItem(Config.STORAGE_KEYS.FAVORITE_SONGS, JSON.stringify([]));
        }
    },

    initModules() {
        Particles.init();
        Navigation.init();
        PlatformSelector.init();
        Recommendation.init();
        Favorites.init();
        History.init();
        Categories.init();
    },

    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    },

    initAutoFocus() {
        setTimeout(() => {
            const textInput = document.getElementById('text-input');
            if (textInput) {
                textInput.focus();
            }
        }, 1000);
    },

    async loadFeaturedSongs() {
        const featuredGrid = document.querySelector('.featured-grid');
        if (!featuredGrid) return;

        Loading.show(featuredGrid, Constants.LOADING_MESSAGES.LOADING_FEATURED);

        try {
            const songs = await Recommendation.fetchRandomSongs(8);
            Recommendation.displayRandomSongs(songs);
        } catch (error) {
            console.error('Failed to load featured songs:', error);
            featuredGrid.innerHTML = `<p class="empty-state">${Constants.EMPTY_STATES.LOAD_FAILED}</p>`;
        }
    },

    destroy() {
        Particles.destroy();
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = App;
}
