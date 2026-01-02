const History = {
    currentPage: 1,
    itemsPerPage: 5,
    maxItems: 30,

    init() {
        this.historyList = document.getElementById('history-list');
        this.totalSongsElement = document.getElementById('total-songs');
        this.render();
    },

    getAll() {
        try {
            return JSON.parse(localStorage.getItem(Config.STORAGE_KEYS.MUSIC_HISTORY) || '[]');
        } catch (error) {
            console.error('Error reading history:', error);
            return [];
        }
    },

    getPaginatedItems() {
        const history = this.getAll();
        const limitedHistory = history.slice(0, this.maxItems);
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        return limitedHistory.slice(startIndex, endIndex);
    },

    getTotalPages() {
        const history = this.getAll();
        const limitedHistory = history.slice(0, this.maxItems);
        return Math.ceil(limitedHistory.length / this.itemsPerPage);
    },

    save(history) {
        try {
            localStorage.setItem(Config.STORAGE_KEYS.MUSIC_HISTORY, JSON.stringify(history));
            this.updateCount();
        } catch (error) {
            console.error('Error saving history:', error);
        }
    },

    add(songs) {
        const history = this.getAll();
        
        const newHistory = songs.map(song => ({
            name: song.name,
            singer: song.singer,
            timestamp: new Date().toISOString()
        }));

        const combined = [...newHistory, ...history];
        
        const uniqueHistory = Utils.unique(combined, item => 
            `${item.name}-${item.singer}`
        );

        const limitedHistory = uniqueHistory.slice(0, Config.LIMITS.MAX_HISTORY_ITEMS);

        this.save(limitedHistory);
        this.currentPage = 1;
        this.render();
    },

    remove(songName, singerName) {
        const history = this.getAll();
        const filtered = history.filter(item => 
            !(item.name === songName && item.singer === singerName)
        );

        this.save(filtered);
        this.render();
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
        if (!this.historyList) return;

        const history = this.getAll();
        const limitedHistory = history.slice(0, this.maxItems);

        if (limitedHistory.length === 0) {
            this.historyList.innerHTML = `<p class="empty-state">${Constants.EMPTY_STATES.NO_HISTORY}</p>`;
            return;
        }

        const paginatedItems = this.getPaginatedItems();
        const totalPages = this.getTotalPages();

        let html = `
            <div class="list-header">
                <div>歌曲名称</div>
                <div>歌手</div>
                <div>时间</div>
                <div>操作</div>
            </div>
        `;

        paginatedItems.forEach(item => {
            html += `
                <div class="history-item">
                    <div class="item-song">${Utils.escapeHtml(item.name)}</div>
                    <div class="item-singer">${Utils.escapeHtml(item.singer)}</div>
                    <div class="item-date">${Utils.formatDate(item.timestamp)}</div>
                    <button class="remove-btn" 
                            data-song="${Utils.escapeHtml(item.name)}"
                            data-singer="${Utils.escapeHtml(item.singer)}">
                        删除
                    </button>
                </div>
            `;
        });

        if (totalPages > 1) {
            html += this.renderPagination(totalPages);
        }

        this.historyList.innerHTML = html;
        this.bindRemoveEvents();
    },

    renderPagination(totalPages) {
        let html = '<div class="pagination">';
        
        html += `
            <button class="pagination-btn" ${this.currentPage === 1 ? 'disabled' : ''} onclick="History.prevPage()">
                上一页
            </button>
        `;

        html += '<div class="pagination-pages">';
        for (let i = 1; i <= totalPages; i++) {
            html += `
                <button class="pagination-page ${i === this.currentPage ? 'active' : ''}" 
                        onclick="History.goToPage(${i})">
                    ${i}
                </button>
            `;
        }
        html += '</div>';

        html += `
            <button class="pagination-btn" ${this.currentPage === totalPages ? 'disabled' : ''} onclick="History.nextPage()">
                下一页
            </button>
        `;

        html += `<span class="pagination-info">第 ${this.currentPage} / ${totalPages} 页</span>`;
        html += '</div>';

        return html;
    },

    bindRemoveEvents() {
        const removeBtns = this.historyList.querySelectorAll('.remove-btn');
        removeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const song = btn.getAttribute('data-song');
                const singer = btn.getAttribute('data-singer');
                this.remove(song, singer);
            });
        });
    },

    updateCount() {
        if (this.totalSongsElement) {
            const history = this.getAll();
            const uniqueSongs = new Set(history.map(item => 
                `${item.name}-${item.singer}`
            ));
            this.totalSongsElement.textContent = uniqueSongs.size;
        }
    },

    getCount() {
        const history = this.getAll();
        const uniqueSongs = new Set(history.map(item => 
            `${item.name}-${item.singer}`
        ));
        return uniqueSongs.size;
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = History;
}
