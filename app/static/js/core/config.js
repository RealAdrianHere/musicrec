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
            color: '#C20C0C',
            playerUrl: 'https://music.163.com/#/search/m/'
        },
        QQ: {
            name: 'QQ音乐',
            icon: '🎶',
            searchUrl: 'https://y.qq.com/portal/search.html#page=1&searchid=1&remoteplace=txt.yqq.all&t=0&key=',
            color: '#31C27C',
            playerUrl: 'https://y.qq.com/portal/search.html#page=1&searchid=1&remoteplace=txt.yqq.all&t=0&key='
        },
        KUGOU: {
            name: '酷狗音乐',
            icon: '🐕',
            searchUrl: 'https://www.kugou.com/yy/html/search.html#searchKeyWord=',
            color: '#FF6B6B',
            playerUrl: 'https://www.kugou.com/yy/html/search.html#searchKeyWord='
        },
        KUWO: {
            name: '酷我音乐',
            icon: '🎸',
            searchUrl: 'https://www.kuwo.cn/search/list?key=',
            color: '#FF9F43',
            playerUrl: 'https://www.kuwo.cn/search/list?key='
        },
        APPLE: {
            name: 'Apple Music',
            icon: '🍎',
            searchUrl: 'https://music.apple.com/cn/search',
            color: '#FA2D48',
            playerUrl: 'https://music.apple.com/cn/search'
        }
    },
    
    DEFAULT_PLATFORM: 'NETEASE'
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Config;
}
