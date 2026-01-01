# Echoes of Mood - 情绪共鸣音乐推荐系统

<div align="center">

![Version](https://img.shields.io/badge/version-2.1.0-blue.svg)
![Python](https://img.shields.io/badge/python-3.7+-green.svg)
![Flask](https://img.shields.io/badge/flask-3.1.2-yellow.svg)
![License](https://img.shields.io/badge/license-MIT-orange.svg)

**基于先进中文嵌入模型的情绪共鸣音乐推荐系统**

[English](./README_EN.md) | 简体中文

</div>

## 1. 项目概述

### 1.1 项目名称
**Echoes of Mood** - 基于海量歌词数据的情绪计算与智能推荐系统

### 1.2 项目简介
Echoes of Mood 是一个基于先进中文嵌入模型的情绪共鸣音乐推荐系统，能够根据用户输入的文本内容，从10万+中文歌词库中推荐语义匹配度最高的歌曲。系统采用治愈系极简设计，提供沉浸式的用户体验。

### 1.3 核心特点
- 🎵 **智能推荐**：基于BGE大模型，理解用户情绪，精准推荐
- 🎨 **治愈系设计**：极简主义风格，沉浸式用户体验
- 🔗 **多平台跳转**：支持网易云音乐、QQ音乐一键跳转播放
- 📱 **响应式设计**：完美适配桌面、平板、手机设备
- ⚡ **高性能**：毫秒级推荐响应，流畅体验
- 🔒 **本地部署**：数据本地化处理，保护隐私

### 1.4 更新日志（v2.1.0）

#### 新增功能
- ✅ **音乐平台跳转功能**：点击推荐结果可直接跳转到网易云音乐或QQ音乐
- ✅ **平台选择器**：支持在网易云音乐和QQ音乐之间切换
- ✅ **收藏功能**：可将喜欢的歌曲添加到收藏夹
- ✅ **历史记录**：自动记录浏览历史
- ✅ **模块化架构**：前端代码完全模块化，便于维护和扩展

#### 优化改进
- ✅ 前端JavaScript模块化重构（13个独立模块）
- ✅ 前端CSS样式模块化（5个独立样式文件）
- ✅ 响应式设计优化，支持深色模式
- ✅ 添加调试日志，便于问题排查
- ✅ 错误处理机制增强

---

## 2. 技术架构

### 2.1 整体架构

```
┌─────────────────────────────────────────────────────────────┐
│                      Echoes of Mood                         │
├────────────────┬─────────────────┬──────────────────────────┤
│    前端层       │     后端层      │         数据层           │
├────────────────┼─────────────────┼──────────────────────────┤
│ HTML5/CSS3     │ Flask 3.1.2    │ 原始歌词数据 (JSON)       │
│ JavaScript ES6 │ PyTorch 2.9.1  │ 清洗后的歌词 (CSV)        │
│ Particles.js   │ BGE Model      │ 歌词嵌入向量 (NPY)        │
│                │ NumPy 2.2.6    │                          │
└────────────────┴─────────────────┴──────────────────────────┘
```

### 2.2 技术栈

| 类别 | 技术 | 版本 | 用途 |
|------|------|------|------|
| 后端框架 | Flask | 3.1.2 | 搭建API服务 |
| 数据处理 | Pandas | 2.3.2 | 数据清洗与处理 |
| 向量化计算 | NumPy | 2.2.6 | 向量存储与计算 |
| 深度学习 | PyTorch | 2.9.1 | 模型加载与推理 |
| 预训练模型 | Transformers | 4.57.1 | BGE模型加载 |
| 前端框架 | Vanilla JS | ES6+ | 页面交互逻辑 |
| 样式方案 | CSS3 Variables | - | 响应式样式系统 |
| 视觉效果 | Particles.js | 2.0.0 | 动态粒子背景 |

### 2.3 模型配置

| 模型 | 参数 | 大小 | 特点 |
|------|------|------|------|
| BAAI/bge-large-zh-v1.5 | ~335M | ~1.3GB | 优秀的中文语义理解，1024维向量 |

---

## 3. 环境要求

### 3.1 基础要求
- **操作系统**：Windows 10+ / macOS 10.14+ / Ubuntu 18.04+
- **Python**：3.7 或更高版本（推荐 3.8-3.11）
- **内存**：最低 4GB，推荐 8GB+
- **存储**：预留 5GB+ 空间（模型+数据）

### 3.2 硬件要求（可选）
- **GPU**：NVIDIA GPU（推荐），支持CUDA加速
- **显存**：4GB+（用于模型推理加速）

### 3.3 依赖安装
```bash
# 克隆项目
git clone https://github.com/KairosUser/musicrec.git
cd musicrec

# 创建虚拟环境（推荐）
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# 安装依赖
pip install -r requirements.txt
```

---

## 4. 安装与启动

### 4.1 快速安装

#### 步骤1：安装依赖
```bash
pip install -r requirements.txt
```

#### 步骤2：数据预处理（首次运行需要）
```bash
# 数据清洗
python scripts/etl.py

# 生成歌词向量（首次会自动下载模型，约1.3GB）
python scripts/vectorize.py
```

#### 步骤3：启动服务
```bash
python run.py
```

#### 步骤4：访问应用
打开浏览器访问：http://127.0.0.1:5000

### 4.2 Docker部署（可选）

```bash
# 构建镜像
docker build -t echoes-of-mood .

# 运行容器
docker run -p 5000:5000 -v $(pwd)/data:/app/data echoes-of-mood
```

### 4.3 生产环境部署

#### 使用Gunicorn
```bash
# 安装gunicorn
pip install gunicorn

# 启动服务（4个工作进程）
gunicorn -w 4 -b 0.0.0.0:5000 run:app

# 后台运行
nohup gunicorn -w 4 -b 0.0.0.0:5000 run:app > app.log 2>&1 &
```

#### Nginx配置
```nginx
server {
    listen 80;
    server_name your_domain.com;
    
    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    
    # 静态文件缓存
    location /static/ {
        alias /path/to/app/static/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

---

## 5. 使用说明

### 5.1 基本使用流程

1. **访问应用**
   打开浏览器，访问 http://127.0.0.1:5000

2. **输入心情文本**
   在文本框中输入你的心情或想法，例如：
   - "今天阳光很好，却感到莫名的孤独"
   - "失恋的痛苦让我无法呼吸"
   - "周末的午后，慵懒的时光"

3. **获取推荐**
   点击"寻找共鸣"按钮或按Enter键

4. **查看结果**
   系统将返回10首最匹配的歌曲

5. **跳转到音乐平台**
   - 点击任意推荐结果卡片
   - 在新标签页打开对应音乐平台的搜索结果
   - 可直接在目标平台播放歌曲

### 5.2 平台切换功能

在导航栏右侧可以选择目标音乐平台：
- 🎵 **网易云音乐**（默认）
- 🎶 **QQ音乐**

切换平台后，所有推荐结果将自动更新跳转链接。

### 5.3 收藏功能

点击推荐结果卡片的❤️按钮可收藏歌曲：
- 收藏的歌曲会保存到个人中心
- 收藏状态会在卡片上显示
- 收藏不会触发跳转

### 5.4 个人中心

访问个人中心可以：
- 查看已听歌曲数量统计
- 浏览历史记录
- 查看收藏的歌曲
- 管理收藏列表

---

## 6. 功能模块说明

### 6.1 前端架构

#### 目录结构
```
app/static/
├── css/                      # 样式文件
│   ├── base.css             # CSS变量和基础样式
│   ├── reset.css            # 样式重置和全局样式
│   ├── components.css       # 可复用组件样式
│   ├── layout.css           # 布局样式
│   └── responsive.css       # 响应式设计
└── js/                       # JavaScript文件
    ├── core/                # 核心模块
    │   ├── config.js        # 配置文件
    │   ├── constants.js     # 常量定义
    │   └── utils.js        # 工具函数
    ├── modules/             # 功能模块
    │   ├── navigation.js    # 导航模块
    │   ├── recommendation.js # 推荐模块
    │   ├── favorites.js     # 收藏模块
    │   ├── history.js       # 历史记录模块
    │   ├── categories.js    # 分类模块
    │   ├── particles.js    # 粒子背景模块
    │   └── platform-selector.js # 平台选择器
    ├── ui/                 # UI组件
    │   ├── notification.js  # 通知组件
    │   └── loading.js      # 加载组件
    └── app.js              # 主入口文件
```

#### 模块职责

| 模块 | 职责 |
|------|------|
| config.js | API端点、存储键、限制配置 |
| constants.js | 通知类型、错误消息、常量定义 |
| utils.js | 防抖节流、格式化、数据处理 |
| navigation.js | 导航栏和板块切换 |
| recommendation.js | 推荐功能和API请求 |
| favorites.js | 收藏功能管理 |
| history.js | 历史记录管理 |
| platform-selector.js | 音乐平台选择和URL生成 |
| notification.js | 通知提示组件 |
| loading.js | 加载状态组件 |

### 6.2 后端架构

#### API接口

| 接口 | 方法 | 参数 | 说明 |
|------|------|------|------|
| `/recommend` | POST | `{text: string, top_n: int}` | 获取推荐结果 |
| `/random-recommend` | GET | `top_n: int` | 获取随机推荐 |

#### 响应格式

```json
{
    "recommendations": [
        {
            "name": "歌曲名",
            "singer": "歌手名",
            "similarity": 0.95
        }
    ]
}
```

---

## 7. 项目结构

```
musicrec_noembedding/
├── app/                      # Flask应用
│   ├── __init__.py           # 应用初始化
│   ├── routes.py             # API路由
│   ├── utils.py              # 核心功能模块
│   ├── static/               # 静态资源
│   │   ├── css/              # 样式文件
│   │   │   ├── base.css
│   │   │   ├── reset.css
│   │   │   ├── components.css
│   │   │   ├── layout.css
│   │   │   └── responsive.css
│   │   └── js/               # JavaScript文件
│   │       ├── core/
│   │       │   ├── config.js
│   │       │   ├── constants.js
│   │       │   └── utils.js
│   │       ├── modules/
│   │       │   ├── navigation.js
│   │       │   ├── recommendation.js
│   │       │   ├── favorites.js
│   │       │   ├── history.js
│   │       │   ├── categories.js
│   │       │   ├── particles.js
│   │       │   └── platform-selector.js
│   │       ├── ui/
│   │       │   ├── notification.js
│   │       │   └── loading.js
│   │       └── app.js
│   └── templates/            # HTML模板
│       └── index.html        # 主页面
├── lyrics_data/              # 原始歌词数据
│   ├── lyrics1.json
│   ├── lyrics2.json
│   ├── lyrics3.json
│   ├── lyrics4.json
│   └── lyrics5.json
├── models/                   # 模型存储
├── scripts/                  # 数据处理脚本
│   ├── etl.py               # 数据清洗脚本
│   └── vectorize.py         # 歌词向量化脚本
├── lyrics_data/              # 歌词数据文件
├── data/                     # 处理后的数据
├── requirements.txt          # Python依赖
├── run.py                   # 应用入口
├── FRONTEND_ARCHITECTURE.md # 前端架构文档
├── FRONTEND_OPTIMIZATION_SUMMARY.md # 优化总结
├── QUICK_START.md           # 快速启动指南
├── MUSIC_PLATFORM_UPDATE.md # 平台跳转功能说明
├── PLATFORM_SWITCH_FIX_REPORT.md # 平台切换问题修复
├── CARD_DISPLAY_FIX_REPORT.md # 卡片显示问题修复
└── README.md                # 本文件
```

---

## 8. 常见问题（FAQ）

### Q1: 首次运行模型下载失败？
**A**: 首次运行会自动从HuggingFace下载模型（约1.3GB）。如果下载失败，可以：
1. 使用国内镜像：配置环境变量 `HF_ENDPOINT=https://hf-mirror.com`
2. 手动下载模型文件放到 `models/` 目录

### Q2: 推荐结果为空？
**A**: 请检查：
1. API服务是否正常运行
2. 数据文件是否完整（`lyrics_embeddings.npy`, `song_info.csv`）
3. 查看浏览器控制台错误信息

### Q3: 卡片不显示？
**A**: 请刷新页面（Ctrl+F5）清除缓存。如果问题持续：
1. 打开浏览器控制台（F12）
2. 查看是否有JavaScript错误
3. 检查网络请求是否正常

### Q4: 平台切换不生效？
**A**: 
1. 确认已选择正确的平台（按钮应高亮显示）
2. 点击卡片后会在新标签页打开
3. 检查浏览器是否阻止弹出窗口

### Q5: 如何修改默认推荐数量？
**A**: 编辑 `app/static/js/core/config.js`：
```javascript
LIMITS: {
    DEFAULT_RECOMMEND_COUNT: 10  // 修改这里
}
```

### Q6: 如何添加新的音乐平台？
**A**: 在 `app/static/js/core/config.js` 中添加：
```javascript
MUSIC_PLATFORMS: {
    NETEASE: { ... },
    QQ: { ... },
    NEW_PLATFORM: {
        name: '新平台名',
        icon: '🎵',
        searchUrl: '搜索URL',
        color: '#颜色代码'
    }
}
```

### Q7: 如何自定义样式？
**A**: 编辑 `app/static/css/base.css` 中的CSS变量：
```css
:root {
    --primary-color: #667eea;  /* 修改主色调 */
    --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Q8: 支持深色模式吗？
**A**: 支持！系统会自动检测系统主题，也可以手动在 `app/static/css/responsive.css` 中调整。

### Q9: 如何清理缓存？
**A**: 
- 浏览器缓存：Ctrl+Shift+R 或 Ctrl+F5
- LocalStorage：在浏览器控制台执行 `localStorage.clear()`

### Q10: 支持移动端吗？
**A**: 支持！系统已优化响应式设计，支持各种屏幕尺寸。

---

## 9. 调试指南

### 9.1 开启调试模式
```bash
# Windows
set FLASK_DEBUG=1
python run.py

# macOS/Linux
FLASK_DEBUG=1 python run.py
```

### 9.2 查看控制台日志
打开浏览器开发者工具（F12），切换到"Console"标签，可看到详细的调试信息。

### 9.3 检查网络请求
切换到"Network"标签，查看API请求和响应数据。

### 9.4 常用调试命令
```javascript
// 在浏览器控制台执行

// 查看当前平台
PlatformSelector.getSelectedPlatform()

// 查看收藏列表
JSON.parse(localStorage.getItem('favoriteSongs'))

// 查看历史记录
JSON.parse(localStorage.getItem('musicHistory'))

// 手动刷新卡片
PlatformSelector.refreshAllCards()
```

---

## 10. 贡献指南

### 10.1 提交问题
遇到问题时，请提供以下信息：
- 操作系统和浏览器版本
- 错误信息截图
- 重现步骤
- 期望行为

### 10.2 功能建议
欢迎提交功能建议！请说明：
- 功能描述
- 使用场景
- 实现思路（可选）

### 10.3 代码贡献
1. Fork本项目
2. 创建功能分支：`git checkout -b feature/amazing-feature`
3. 提交更改：`git commit -m 'Add amazing feature'`
4. 推送到分支：`git push origin feature/amazing-feature`
5. 创建Pull Request

### 10.4 代码规范
- JavaScript遵循ES6+标准
- CSS使用BEM命名规范
- 提交前运行代码检查
- 添加必要的注释

---

## 11. 性能优化

### 11.1 当前性能指标
| 指标 | 数值 |
|------|------|
| 推荐响应时间 | < 200ms |
| 模型加载时间 | < 5s |
| 支持并发 | 100+ QPS |

### 11.2 优化建议
1. **使用GPU加速**：BGE模型在GPU上推理更快
2. **模型量化**：考虑使用INT8量化减小模型体积
3. **缓存机制**：对频繁查询的文本嵌入进行缓存
4. **预计算向量**：预先计算所有歌词的嵌入向量

---

## 12. 后续规划

### 短期目标
- [ ] 引入TypeScript
- [ ] 添加单元测试
- [ ] 集成代码检查工具（ESLint）
- [ ] 实现歌曲播放功能

### 中期目标
- [ ] 用户登录系统
- [ ] 社交分享功能
- [ ] 歌曲评论功能
- [ ] 引入状态管理（Redux/Vuex）

### 长期目标
- [ ] PWA支持（离线访问）
- [ ] 服务端渲染
- [ ] 国际化支持
- [ ] 语音输入

---

## 13. 相关文档

- [前端架构文档](./FRONTEND_ARCHITECTURE.md)
- [优化总结报告](./FRONTEND_OPTIMIZATION_SUMMARY.md)
- [快速启动指南](./QUICK_START.md)
- [音乐平台跳转功能说明](./MUSIC_PLATFORM_UPDATE.md)
- [平台切换问题修复报告](./PLATFORM_SWITCH_FIX_REPORT.md)
- [卡片显示问题修复报告](./CARD_DISPLAY_FIX_REPORT.md)

---

## 14. 参考文献

1. [BERT: Pre-training of Deep Bidirectional Transformers](https://arxiv.org/abs/1810.04805)
2. [BGE Model - FlagEmbedding](https://github.com/FlagOpen/FlagEmbedding)
3. [ChineseLyrics 中文歌词数据库](https://github.com/dengxiuqi/ChineseLyrics)
4. [MTEB 基准测试](https://huggingface.co/spaces/mteb/leaderboard)
5. [HuggingFace Transformers](https://huggingface.co/docs/transformers)
6. [Flask Web开发](https://flask.palletsprojects.com/)

---

## 15. 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件。

---

## 16. 联系方式

- **项目地址**：https://github.com/KairosUser/musicrec
- **作者**：Junerainmoon
- **邮箱**：junerainmoon@126.com

---

<div align="center">

**如果这个项目对你有帮助，请给我们一个⭐️！**

Made with ❤️ by Echoes of Mood Team

</div>
