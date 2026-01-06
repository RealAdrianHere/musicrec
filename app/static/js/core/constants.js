const Constants = {
    NOTIFICATION_TYPES: {
        SUCCESS: 'success',
        ERROR: 'error',
        WARNING: 'warning',
        INFO: 'info'
    },

    NOTIFICATION_COLORS: {
        success: '#48bb78',
        error: '#f56565',
        warning: '#ed8936',
        info: '#4299e1'
    },

    NAVIGATION_SECTIONS: {
        DISCOVER: 'discover',
        MOOD_RECOMMENDATION: 'mood-recommendation',
        PROFILE: 'profile'
    },

    MUSIC_CATEGORIES: {
        ROCK: {
            name: '摇滚',
            icon: '🎸',
            description: '释放内心的激情',
            text: '充满激情的摇滚音乐，释放你的能量'
        },
        CLASSICAL: {
            name: '古典',
            icon: '🎹',
            description: '感受优雅与深度',
            text: '优雅的古典音乐，感受艺术的魅力'
        },
        POP: {
            name: '流行',
            icon: '🎤',
            description: '聆听时代的声音',
            text: '流行音乐，聆听时代的声音'
        },
        ELECTRONIC: {
            name: '电子',
            icon: '🎧',
            description: '沉浸在节奏中',
            text: '动感的电子音乐，沉浸在节奏中'
        }
    },

    EMPTY_STATES: {
        NO_RESULTS: '没有找到匹配的歌曲',
        NO_HISTORY: '暂无历史记录',
        NO_FAVORITES: '暂无收藏歌曲',
        NO_FEATURED: '暂无热门推荐',
        LOAD_FAILED: '加载失败，请稍后重试'
    },

    ERROR_MESSAGES: {
        EMPTY_INPUT: '请输入文本内容',
        NETWORK_ERROR: '网络请求失败，请稍后重试',
        SERVER_ERROR: '服务器内部错误，请稍后重试',
        INVALID_RESPONSE: '服务器返回了无效的响应'
    },

    SUCCESS_MESSAGES: {
        RECOMMENDATIONS_FOUND: (count) => `找到 ${count} 首匹配的歌曲`,
        ADDED_TO_FAVORITES: '已添加到收藏',
        REMOVED_FROM_FAVORITES: '已取消收藏',
        CLEARED_HISTORY: '历史记录已清空',
        USERNAME_UPDATED: '用户名已更新',
        AVATAR_UPDATED: '头像已更新'
    },

    LOADING_MESSAGES: {
        SEARCHING: '正在寻找与你共鸣的歌曲...',
        LOADING_FEATURED: '正在加载热门推荐...'
    },

    MUSIC_PLATFORMS: {
        NETEASE: 'NETEASE',
        QQ: 'QQ'
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Constants;
}
