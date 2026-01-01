const Config = {
    API_BASE_URL: '',
    ENDPOINTS: {
        RECOMMEND: '/recommend',
        RANDOM_RECOMMEND: '/random-recommend'
    },
    
    STORAGE_KEYS: {
        MUSIC_HISTORY: 'musicHistory',
        FAVORITE_SONGS: 'favoriteSongs',
        SELECTED_PLATFORM: 'selectedPlatform'
    },
    
    LIMITS: {
        MAX_TEXT_LENGTH: 500,
        MAX_HISTORY_ITEMS: 50,
        DEFAULT_RECOMMEND_COUNT: 10,
        MAX_RECOMMEND_COUNT: 50,
        MIN_RECOMMEND_COUNT: 1
    },
    
    CACHE: {
        SIZE: 100
    },
    
    NOTIFICATION: {
        DURATION: 3000
    },
    
    ANIMATION: {
        CARD_DELAY: 100
    },
    
    MUSIC_PLATFORMS: {
        NETEASE: {
            name: '网易云音乐',
            icon: '🎵',
            searchUrl: 'https://music.163.com/#/search/m/',
            color: '#C20C0C'
        },
        QQ: {
            name: 'QQ音乐',
            icon: '🎶',
            searchUrl: 'https://y.qq.com/portal/search.html#page=1&searchid=1&remoteplace=txt.yqq.all&t=0&key=',
            color: '#31C27C'
        }
    },
    
    DEFAULT_PLATFORM: 'NETEASE'
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Config;
}
