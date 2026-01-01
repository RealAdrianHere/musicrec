const History = {
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
        this.render();
        Notification.show(
            Constants.SUCCESS_MESSAGES.CLEARED_HISTORY,
            Constants.NOTIFICATION_TYPES.INFO
        );
    },

    render() {
        if (!this.historyList) return;

        const history = this.getAll();

        if (history.length === 0) {
            this.historyList.innerHTML = `<p class="empty-state">${Constants.EMPTY_STATES.NO_HISTORY}</p>`;
            return;
        }

        this.historyList.innerHTML = history.map(item => `
            <div class="history-item">
                <div class="item-info">
                    <div class="item-song">${Utils.escapeHtml(item.name)}</div>
                    <div class="item-singer">${Utils.escapeHtml(item.singer)}</div>
                    <div class="item-date">${Utils.formatDate(item.timestamp)}</div>
                </div>
                <button class="remove-btn" 
                        onclick="History.remove('${Utils.escapeHtml(item.name)}', '${Utils.escapeHtml(item.singer)}')">
                    删除
                </button>
            </div>
        `).join('');
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
