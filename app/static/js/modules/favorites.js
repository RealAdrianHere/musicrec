const Favorites = {
    currentPage: 1,
    itemsPerPage: 5,
    maxItems: 30,

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

    getPaginatedItems() {
        const favorites = this.getAll();
        const limitedFavorites = favorites.slice(0, this.maxItems);
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        return limitedFavorites.slice(startIndex, endIndex);
    },

    getTotalPages() {
        const favorites = this.getAll();
        const limitedFavorites = favorites.slice(0, this.maxItems);
        return Math.ceil(limitedFavorites.length / this.itemsPerPage);
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
        this.currentPage = 1;
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
        this.currentPage = 1;
        this.render();
        Notification.show(
            Constants.SUCCESS_MESSAGES.CLEARED_HISTORY,
            Constants.NOTIFICATION_TYPES.INFO
        );
    },

    goToPage(page) {
        const totalPages = this.getTotalPages();
        if (page < 1 || page > totalPages) return;
        this.currentPage = page;
        this.render();
    },

    nextPage() {
        const totalPages = this.getTotalPages();
        if (this.currentPage < totalPages) {
            this.currentPage++;
            this.render();
        }
    },

    prevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.render();
        }
    },

    render() {
        if (!this.favoritesList) return;

        const favorites = this.getAll();
        const limitedFavorites = favorites.slice(0, this.maxItems);

        if (limitedFavorites.length === 0) {
            this.favoritesList.innerHTML = `<p class="empty-state">${Constants.EMPTY_STATES.NO_FAVORITES}</p>`;
            return;
        }

        const paginatedItems = this.getPaginatedItems();
        const totalPages = this.getTotalPages();

        let html = `
            <div class="list-header">
                <div>歌曲名称</div>
                <div>歌手</div>
                <div>收藏时间</div>
                <div>操作</div>
            </div>
        `;

        paginatedItems.forEach(item => {
            html += `
                <div class="favorite-item">
                    <div class="item-song">${Utils.escapeHtml(item.name)}</div>
                    <div class="item-singer">${Utils.escapeHtml(item.singer)}</div>
                    <div class="item-date">${Utils.formatDate(item.addedAt)}</div>
                    <button class="remove-btn" 
                            data-song="${Utils.escapeHtml(item.name)}"
                            data-singer="${Utils.escapeHtml(item.singer)}">
                        取消收藏
                    </button>
                </div>
            `;
        });

        if (totalPages > 1) {
            html += this.renderPagination(totalPages);
        }

        this.favoritesList.innerHTML = html;
        this.bindRemoveEvents();
    },

    renderPagination(totalPages) {
        let html = '<div class="pagination">';
        
        html += `
            <button class="pagination-btn" ${this.currentPage === 1 ? 'disabled' : ''} onclick="Favorites.prevPage()">
                上一页
            </button>
        `;

        html += '<div class="pagination-pages">';
        for (let i = 1; i <= totalPages; i++) {
            html += `
                <button class="pagination-page ${i === this.currentPage ? 'active' : ''}" 
                        onclick="Favorites.goToPage(${i})">
                    ${i}
                </button>
            `;
        }
        html += '</div>';

        html += `
            <button class="pagination-btn" ${this.currentPage === totalPages ? 'disabled' : ''} onclick="Favorites.nextPage()">
                下一页
            </button>
        `;

        html += `<span class="pagination-info">第 ${this.currentPage} / ${totalPages} 页</span>`;
        html += '</div>';

        return html;
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
