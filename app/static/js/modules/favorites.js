const Favorites = {
    init() {
        this.favoritesList = document.getElementById('favorites-list');
        this.favCountElement = document.getElementById('fav-songs');
        this.bindEvents();
        this.render();
    },

    bindEvents() {
        const favBtns = document.querySelectorAll('.fav-btn');
        favBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const song = btn.getAttribute('data-song');
                const singer = btn.getAttribute('data-singer');
                this.toggle(song, singer, btn);
            });
        });
    },

    getAll() {
        try {
            return JSON.parse(localStorage.getItem(Config.STORAGE_KEYS.FAVORITE_SONGS) || '[]');
        } catch (error) {
            console.error('Error reading favorites:', error);
            return [];
        }
    },

    save(favorites) {
        try {
            localStorage.setItem(Config.STORAGE_KEYS.FAVORITE_SONGS, JSON.stringify(favorites));
            this.updateCount();
        } catch (error) {
            console.error('Error saving favorites:', error);
        }
    },

    isFavorite(songName, singerName) {
        const favorites = this.getAll();
        return favorites.some(fav => 
            fav.name === songName && fav.singer === singerName
        );
    },

    add(songName, singerName) {
        const favorites = this.getAll();
        
        if (this.isFavorite(songName, singerName)) {
            return false;
        }

        favorites.push({
            name: songName,
            singer: singerName,
            addedAt: new Date().toISOString()
        });

        this.save(favorites);
        this.render();
        return true;
    },

    remove(songName, singerName) {
        const favorites = this.getAll();
        const filtered = favorites.filter(fav => 
            !(fav.name === songName && fav.singer === singerName)
        );

        this.save(filtered);
        this.render();
        return true;
    },

    toggle(songName, singerName, btnElement = null) {
        if (this.isFavorite(songName, singerName)) {
            this.remove(songName, singerName);
            if (btnElement) {
                btnElement.classList.remove('active');
            }
            Notification.show(
                Constants.SUCCESS_MESSAGES.REMOVED_FROM_FAVORITES,
                Constants.NOTIFICATION_TYPES.INFO
            );
        } else {
            this.add(songName, singerName);
            if (btnElement) {
                btnElement.classList.add('active');
            }
            Notification.show(
                Constants.SUCCESS_MESSAGES.ADDED_TO_FAVORITES,
                Constants.NOTIFICATION_TYPES.SUCCESS
            );
        }
    },

    clear() {
        this.save([]);
        this.render();
        Notification.show(
            Constants.SUCCESS_MESSAGES.CLEARED_HISTORY,
            Constants.NOTIFICATION_TYPES.INFO
        );
    },

    render() {
        if (!this.favoritesList) return;

        const favorites = this.getAll();

        if (favorites.length === 0) {
            this.favoritesList.innerHTML = `<p class="empty-state">${Constants.EMPTY_STATES.NO_FAVORITES}</p>`;
            return;
        }

        this.favoritesList.innerHTML = favorites.map(item => `
            <div class="favorite-item">
                <div class="item-info">
                    <div class="item-song">${Utils.escapeHtml(item.name)}</div>
                    <div class="item-singer">${Utils.escapeHtml(item.singer)}</div>
                </div>
                <button class="remove-btn" 
                        data-song="${Utils.escapeHtml(item.name)}"
                        data-singer="${Utils.escapeHtml(item.singer)}">
                    取消收藏
                </button>
            </div>
        `).join('');

        this.bindRemoveEvents();
    },

    bindRemoveEvents() {
        const removeBtns = this.favoritesList.querySelectorAll('.remove-btn');
        removeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const song = btn.getAttribute('data-song');
                const singer = btn.getAttribute('data-singer');
                this.remove(song, singer);
            });
        });
    },

    updateCount() {
        if (this.favCountElement) {
            const count = this.getAll().length;
            this.favCountElement.textContent = count;
        }
    },

    getCount() {
        return this.getAll().length;
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Favorites;
}
