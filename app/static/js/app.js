// 文档加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化本地存储
    initLocalStorage();
    
    // 初始化粒子背景
    initParticles();
    
    // 初始化导航功能
    initNavigation();
    
    // 初始化事件监听
    initEventListeners();
    
<<<<<<< HEAD
    // 添加平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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
    
    // 初始化分类点击事件
    initCategoryClick();
    
    // 更新个人中心统计
    updateProfileStats();
    
    // 获取并显示随机推荐歌曲
    fetchRandomSongs();
    
    // 页面加载完成后，为输入框添加焦点效果
    setTimeout(() => {
        const textInput = document.getElementById('text-input');
        textInput.focus();
    }, 1000);
=======
    // 初始化本地存储
    initLocalStorage();
    
    // 更新个人中心统计
    updateProfileStats();
>>>>>>> a4f314cbacd1a1343366eaa21fbaf12129b3eef7
});

// 初始化导航功能
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 获取目标板块
            const targetSection = this.getAttribute('data-section');
            
            // 移除所有活动状态
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            // 添加当前活动状态
            this.classList.add('active');
            document.getElementById(targetSection).classList.add('active');
        });
    });
}

// 初始化粒子背景
function initParticles() {
    particlesJS('particles-js', {
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: "#ffffff"
            },
            shape: {
                type: "circle",
                stroke: {
                    width: 0,
                    color: "#000000"
                },
                polygon: {
                    nb_sides: 5
                }
            },
            opacity: {
                value: 0.5,
                random: true,
                anim: {
                    enable: false,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 3,
                random: true,
                anim: {
                    enable: false,
                    speed: 40,
                    size_min: 0.1,
                    sync: false
                }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: "#ffffff",
                opacity: 0.4,
                width: 1
            },
            move: {
                enable: true,
                speed: 6,
                direction: "none",
                random: false,
                straight: false,
                out_mode: "out",
                bounce: false,
                attract: {
                    enable: false,
                    rotateX: 600,
                    rotateY: 1200
                }
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: {
                    enable: true,
                    mode: "grab"
                },
                onclick: {
                    enable: true,
                    mode: "push"
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 140,
                    line_linked: {
                        opacity: 1
                    }
                },
                bubble: {
                    distance: 400,
                    size: 40,
                    duration: 2,
                    opacity: 8,
                    speed: 3
                },
                repulse: {
                    distance: 200,
                    duration: 0.4
                },
                push: {
                    particles_nb: 4
                },
                remove: {
                    particles_nb: 2
                }
            }
        },
        retina_detect: true
    });
}

// 初始化本地存储
function initLocalStorage() {
    if (!localStorage.getItem('musicHistory')) {
        localStorage.setItem('musicHistory', JSON.stringify([]));
    }
    if (!localStorage.getItem('favoriteSongs')) {
        localStorage.setItem('favoriteSongs', JSON.stringify([]));
    }
}

// 初始化事件监听
function initEventListeners() {
    const textInput = document.getElementById('text-input');
    const charCount = document.getElementById('char-count');
    const submitBtn = document.getElementById('submit-btn');
    
    // 字符计数
    textInput.addEventListener('input', function() {
        const count = this.value.length;
        const max = 500;
        charCount.textContent = `${count}/${max}`;
        
        // 超过最大字符数时显示警告
        if (count > max) {
            charCount.style.color = '#e53e3e';
            this.value = this.value.substring(0, max);
            charCount.textContent = `${max}/${max}`;
        } else {
            charCount.style.color = '#a0aec0';
        }
    });
    
    // 提交按钮点击事件
    submitBtn.addEventListener('click', function() {
        submitForm();
    });
    
    // 回车键提交（需要按住Shift+Enter换行）
    textInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submitForm();
        }
    });
}

// 表单提交
function submitForm() {
    const textInput = document.getElementById('text-input');
    const text = textInput.value.trim();
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    
    // 验证输入
    if (!text) {
        showNotification('请输入文本内容', 'error');
        textInput.focus();
        return;
    }
    
    // 禁用按钮，防止重复提交
    submitBtn.disabled = true;
    btnText.textContent = '寻找中...';
    
    // 显示加载状态
    showLoading();
    
    // 发送请求
    fetch('/recommend', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text: text,
            top_n: 10
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        // 隐藏加载状态
        hideLoading();
        
        // 恢复按钮状态
        submitBtn.disabled = false;
        btnText.textContent = '寻找共鸣';
        
        // 处理响应
        if (data.error) {
            showNotification('发生错误: ' + data.error, 'error');
            return;
        }
        
        if (!data.recommendations || data.recommendations.length === 0) {
            showNotification('没有找到匹配的歌曲', 'info');
            displayResults([]);
            return;
        }
        
        // 显示结果
        displayResults(data.recommendations);
        
        // 添加到历史记录
        addToHistory(data.recommendations);
        
<<<<<<< HEAD
        // 显示成功通知
        showNotification(`找到 ${data.recommendations.length} 首匹配的歌曲`, 'success');
        
=======
>>>>>>> a4f314cbacd1a1343366eaa21fbaf12129b3eef7
        // 滚动到结果区域
        scrollToResults();
    })
    .catch(error => {
        hideLoading();
        // 恢复按钮状态
        submitBtn.disabled = false;
        btnText.textContent = '寻找共鸣';
        
        console.error('请求失败:', error);
        showNotification('网络请求失败，请稍后重试', 'error');
    });
}

// 显示通知
function showNotification(message, type = 'info') {
    // 移除已存在的通知
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // 添加样式
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 25px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '10000',
        animation: 'slideInRight 0.3s ease',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
        maxWidth: '350px',
        wordWrap: 'break-word'
    });
    
    // 设置不同类型的背景色
    switch(type) {
        case 'success':
            notification.style.backgroundColor = '#48bb78';
            break;
        case 'error':
            notification.style.backgroundColor = '#f56565';
            break;
        case 'warning':
            notification.style.backgroundColor = '#ed8936';
            break;
        case 'info':
        default:
            notification.style.backgroundColor = '#4299e1';
            break;
    }
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 3秒后自动移除
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}



// 显示加载状态
function showLoading() {
    const loading = document.getElementById('loading');
    const results = document.getElementById('results');
    
    loading.classList.remove('hidden');
    results.innerHTML = '';
}

// 隐藏加载状态
function hideLoading() {
    const loading = document.getElementById('loading');
    loading.classList.add('hidden');
}

// 显示结果
function displayResults(recommendations) {
    const results = document.getElementById('results');
    
    // 清空之前的结果
    results.innerHTML = '';
    
    // 如果没有结果
    if (recommendations.length === 0) {
        results.innerHTML = '<p class="empty-state">没有找到匹配的歌曲</p>';
        return;
    }
    
    // 获取收藏列表
    const favorites = JSON.parse(localStorage.getItem('favoriteSongs') || '[]');
    
    // 创建结果卡片
    recommendations.forEach((song, index) => {
        const card = document.createElement('div');
        card.className = 'result-card';
        card.style.animationDelay = `${index * 0.1}s`;
        
        // 格式化相似度分数
        const similarity = (song.similarity * 100).toFixed(1);
        
        // 检查是否已收藏
        const isFavorite = favorites.some(fav => fav.name === song.name && fav.singer === song.singer);
        
        card.innerHTML = `
            <div class="song-name">
                <span>${song.name}</span>
                <button class="fav-btn ${isFavorite ? 'active' : ''}" data-song="${song.name}" data-singer="${song.singer}">
                    ❤️
                </button>
            </div>
            <p class="singer-name">🎤 ${song.singer}</p>
            <p class="similarity-score">相似度: ${similarity}%</p>
        `;
        
        results.appendChild(card);
    });
    
    // 为收藏按钮添加事件监听
    addFavBtnListeners();
<<<<<<< HEAD
}

// 为收藏按钮添加事件监听
function addFavBtnListeners() {
    const favBtns = document.querySelectorAll('.fav-btn');
    
    favBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const song = this.getAttribute('data-song');
            const singer = this.getAttribute('data-singer');
            
            toggleFavorite(song, singer);
            this.classList.toggle('active');
        });
    });
}

// 切换收藏状态
function toggleFavorite(songName, singerName) {
    let favorites = JSON.parse(localStorage.getItem('favoriteSongs') || '[]');
    
    // 检查是否已收藏
    const index = favorites.findIndex(fav => fav.name === songName && fav.singer === singerName);
    
    if (index > -1) {
        // 移除收藏
        favorites.splice(index, 1);
    } else {
        // 添加收藏
        favorites.push({ name: songName, singer: singerName, addedAt: new Date().toISOString() });
    }
    
    // 保存到本地存储
    localStorage.setItem('favoriteSongs', JSON.stringify(favorites));
    
    // 更新个人中心
    updateProfileStats();
    renderFavorites();
}

// 添加到历史记录
function addToHistory(songs) {
    let history = JSON.parse(localStorage.getItem('musicHistory') || '[]');
    
    // 添加新记录
    const newHistory = songs.map(song => ({
        name: song.name,
        singer: song.singer,
        timestamp: new Date().toISOString()
    }));
    
    // 合并并去重
    history = [...newHistory, ...history];
    
    // 移除重复项（保留最新）
    const uniqueHistory = [];
    const seen = new Set();
    
    for (const item of history) {
        const key = `${item.name}-${item.singer}`;
        if (!seen.has(key)) {
            seen.add(key);
            uniqueHistory.push(item);
        }
    }
    
    // 保留最近50条记录
    history = uniqueHistory.slice(0, 50);
    
    // 保存到本地存储
    localStorage.setItem('musicHistory', JSON.stringify(history));
    
    // 更新个人中心
    updateProfileStats();
    renderHistory();
}

// 渲染历史记录
function renderHistory() {
    const historyList = document.getElementById('history-list');
    const history = JSON.parse(localStorage.getItem('musicHistory') || '[]');
    
    if (history.length === 0) {
        historyList.innerHTML = '<p class="empty-state">暂无历史记录</p>';
        return;
    }
    
    historyList.innerHTML = history.map(item => {
        const date = new Date(item.timestamp).toLocaleString('zh-CN');
        return `
            <div class="history-item">
                <div class="item-info">
                    <div class="item-song">${item.name}</div>
                    <div class="item-singer">${item.singer}</div>
                    <div class="item-date">${date}</div>
                </div>
                <button class="remove-btn" onclick="removeFromHistory('${item.name}', '${item.singer}')">删除</button>
            </div>
        `;
    }).join('');
}

// 渲染收藏列表
function renderFavorites() {
    const favoritesList = document.getElementById('favorites-list');
    const favorites = JSON.parse(localStorage.getItem('favoriteSongs') || '[]');
    
    if (favorites.length === 0) {
        favoritesList.innerHTML = '<p class="empty-state">暂无收藏歌曲</p>';
        return;
    }
    
    favoritesList.innerHTML = favorites.map(item => {
        return `
            <div class="favorite-item">
                <div class="item-info">
                    <div class="item-song">${item.name}</div>
                    <div class="item-singer">${item.singer}</div>
                </div>
                <button class="remove-btn" onclick="removeFromFavorites('${item.name}', '${item.singer}')">取消收藏</button>
            </div>
        `;
    }).join('');
}

// 从历史记录中移除
function removeFromHistory(songName, singerName) {
    let history = JSON.parse(localStorage.getItem('musicHistory') || '[]');
    history = history.filter(item => !(item.name === songName && item.singer === singerName));
    localStorage.setItem('musicHistory', JSON.stringify(history));
    updateProfileStats();
    renderHistory();
}

// 从收藏中移除
function removeFromFavorites(songName, singerName) {
    let favorites = JSON.parse(localStorage.getItem('favoriteSongs') || '[]');
    favorites = favorites.filter(item => !(item.name === songName && item.singer === singerName));
    localStorage.setItem('favoriteSongs', JSON.stringify(favorites));
    updateProfileStats();
    renderFavorites();
}

// 更新个人中心统计
function updateProfileStats() {
    const history = JSON.parse(localStorage.getItem('musicHistory') || '[]');
    const favorites = JSON.parse(localStorage.getItem('favoriteSongs') || '[]');
    
    // 更新统计数字
    document.getElementById('total-songs').textContent = new Set(history.map(item => `${item.name}-${item.singer}`)).size;
    document.getElementById('fav-songs').textContent = favorites.length;
    
    // 渲染列表
    renderHistory();
    renderFavorites();
}

// 滚动到结果区域
function scrollToResults() {
    const resultsSection = document.querySelector('.results-section');
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// 获取并显示随机推荐歌曲
function fetchRandomSongs() {
    const featuredGrid = document.querySelector('.featured-grid');
    
    // 显示加载状态
    featuredGrid.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>正在加载热门推荐...</p>
        </div>
    `;
    
    // 发送请求获取随机歌曲
    fetch('/random-recommend?top_n=6')
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                showNotification('加载热门推荐失败', 'error');
                featuredGrid.innerHTML = '<p class="empty-state">加载热门推荐失败，请稍后重试</p>';
                return;
            }
            
            // 显示随机推荐结果
            displayFeaturedSongs(data.recommendations);
        })
        .catch(error => {
            console.error('获取随机推荐失败:', error);
            showNotification('网络请求失败，请稍后重试', 'error');
            featuredGrid.innerHTML = '<p class="empty-state">加载热门推荐失败，请稍后重试</p>';
        });
}

// 显示热门推荐歌曲
function displayFeaturedSongs(songs) {
    const featuredGrid = document.querySelector('.featured-grid');
    
    if (songs.length === 0) {
        featuredGrid.innerHTML = '<p class="empty-state">暂无热门推荐</p>';
        return;
    }
    
    // 创建结果卡片
    featuredGrid.innerHTML = songs.map((song, index) => `
        <div class="result-card" style="animation-delay: ${index * 0.1}s">
            <div class="song-name">
                <span>${song.name}</span>
                <button class="fav-btn" data-song="${song.name}" data-singer="${song.singer}">
                    ❤️
                </button>
            </div>
            <p class="singer-name">🎤 ${song.singer}</p>
            <p class="similarity-score">热门推荐</p>
        </div>
    `).join('');
    
    // 为收藏按钮添加事件监听
    addFavBtnListeners();
}

// 初始化分类点击事件
function initCategoryClick() {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const categoryName = this.querySelector('.category-name').textContent;
            
            // 显示分类点击效果
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 100);
            
            // 这里可以根据分类名称执行不同的逻辑
            // 例如：跳转到分类页面或显示该分类下的歌曲
            showNotification(`点击了${categoryName}分类`, 'info');
            
            // 示例：可以根据分类名称生成相关的推荐文本
            const categoryTexts = {
                '摇滚': '充满激情的摇滚音乐，释放你的能量',
                '古典': '优雅的古典音乐，感受艺术的魅力',
                '流行': '流行音乐，聆听时代的声音',
                '电子': '动感的电子音乐，沉浸在节奏中'
            };
            
            const recommendText = categoryTexts[categoryName] || `探索${categoryName}音乐世界`;
            
            // 切换到情绪推荐板块并填充文本
            const moodSection = document.getElementById('mood-recommendation');
            const textInput = document.getElementById('text-input');
            const navLinks = document.querySelectorAll('.nav-link');
            
            // 切换导航状态
            navLinks.forEach(link => link.classList.remove('active'));
            document.querySelector('[data-section="mood-recommendation"]').classList.add('active');
            
            // 切换板块
            document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
            moodSection.classList.add('active');
            
            // 填充文本并自动提交
            textInput.value = recommendText;
            textInput.dispatchEvent(new Event('input')); // 触发字符计数更新
        });
    });
}
=======
}

// 为收藏按钮添加事件监听
function addFavBtnListeners() {
    const favBtns = document.querySelectorAll('.fav-btn');
    
    favBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const song = this.getAttribute('data-song');
            const singer = this.getAttribute('data-singer');
            
            toggleFavorite(song, singer);
            this.classList.toggle('active');
        });
    });
}

// 切换收藏状态
function toggleFavorite(songName, singerName) {
    let favorites = JSON.parse(localStorage.getItem('favoriteSongs') || '[]');
    
    // 检查是否已收藏
    const index = favorites.findIndex(fav => fav.name === songName && fav.singer === singerName);
    
    if (index > -1) {
        // 移除收藏
        favorites.splice(index, 1);
    } else {
        // 添加收藏
        favorites.push({ name: songName, singer: singerName, addedAt: new Date().toISOString() });
    }
    
    // 保存到本地存储
    localStorage.setItem('favoriteSongs', JSON.stringify(favorites));
    
    // 更新个人中心
    updateProfileStats();
    renderFavorites();
}

// 添加到历史记录
function addToHistory(songs) {
    let history = JSON.parse(localStorage.getItem('musicHistory') || '[]');
    
    // 添加新记录
    const newHistory = songs.map(song => ({
        name: song.name,
        singer: song.singer,
        timestamp: new Date().toISOString()
    }));
    
    // 合并并去重
    history = [...newHistory, ...history];
    
    // 移除重复项（保留最新）
    const uniqueHistory = [];
    const seen = new Set();
    
    for (const item of history) {
        const key = `${item.name}-${item.singer}`;
        if (!seen.has(key)) {
            seen.add(key);
            uniqueHistory.push(item);
        }
    }
    
    // 保留最近50条记录
    history = uniqueHistory.slice(0, 50);
    
    // 保存到本地存储
    localStorage.setItem('musicHistory', JSON.stringify(history));
    
    // 更新个人中心
    updateProfileStats();
    renderHistory();
}

// 渲染历史记录
function renderHistory() {
    const historyList = document.getElementById('history-list');
    const history = JSON.parse(localStorage.getItem('musicHistory') || '[]');
    
    if (history.length === 0) {
        historyList.innerHTML = '<p class="empty-state">暂无历史记录</p>';
        return;
    }
    
    historyList.innerHTML = history.map(item => {
        const date = new Date(item.timestamp).toLocaleString('zh-CN');
        return `
            <div class="history-item">
                <div class="item-info">
                    <div class="item-song">${item.name}</div>
                    <div class="item-singer">${item.singer}</div>
                    <div class="item-date">${date}</div>
                </div>
                <button class="remove-btn" onclick="removeFromHistory('${item.name}', '${item.singer}')">删除</button>
            </div>
        `;
    }).join('');
}

// 渲染收藏列表
function renderFavorites() {
    const favoritesList = document.getElementById('favorites-list');
    const favorites = JSON.parse(localStorage.getItem('favoriteSongs') || '[]');
    
    if (favorites.length === 0) {
        favoritesList.innerHTML = '<p class="empty-state">暂无收藏歌曲</p>';
        return;
    }
    
    favoritesList.innerHTML = favorites.map(item => {
        return `
            <div class="favorite-item">
                <div class="item-info">
                    <div class="item-song">${item.name}</div>
                    <div class="item-singer">${item.singer}</div>
                </div>
                <button class="remove-btn" onclick="removeFromFavorites('${item.name}', '${item.singer}')">取消收藏</button>
            </div>
        `;
    }).join('');
}

// 从历史记录中移除
function removeFromHistory(songName, singerName) {
    let history = JSON.parse(localStorage.getItem('musicHistory') || '[]');
    history = history.filter(item => !(item.name === songName && item.singer === singerName));
    localStorage.setItem('musicHistory', JSON.stringify(history));
    updateProfileStats();
    renderHistory();
}

// 从收藏中移除
function removeFromFavorites(songName, singerName) {
    let favorites = JSON.parse(localStorage.getItem('favoriteSongs') || '[]');
    favorites = favorites.filter(item => !(item.name === songName && item.singer === singerName));
    localStorage.setItem('favoriteSongs', JSON.stringify(favorites));
    updateProfileStats();
    renderFavorites();
}

// 更新个人中心统计
function updateProfileStats() {
    const history = JSON.parse(localStorage.getItem('musicHistory') || '[]');
    const favorites = JSON.parse(localStorage.getItem('favoriteSongs') || '[]');
    
    // 更新统计数字
    document.getElementById('total-songs').textContent = new Set(history.map(item => `${item.name}-${item.singer}`)).size;
    document.getElementById('fav-songs').textContent = favorites.length;
    
    // 渲染列表
    renderHistory();
    renderFavorites();
}

// 滚动到结果区域
function scrollToResults() {
    const resultsSection = document.querySelector('.results-section');
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// 初始化本地存储
function initLocalStorage() {
    if (!localStorage.getItem('musicHistory')) {
        localStorage.setItem('musicHistory', JSON.stringify([]));
    }
    if (!localStorage.getItem('favoriteSongs')) {
        localStorage.setItem('favoriteSongs', JSON.stringify([]));
    }
}

// 添加一些额外的交互效果
document.addEventListener('DOMContentLoaded', function() {
    // 添加鼠标跟随效果（可选）
    let mouseX = 0;
    let mouseY = 0;
    let particlesContainer = document.getElementById('particles-js');
    
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // 添加平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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
});
>>>>>>> a4f314cbacd1a1343366eaa21fbaf12129b3eef7

