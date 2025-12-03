from flask import render_template, request, jsonify, g
import time
from app import app
from app.utils import song_recommender
import logging

# 配置日志
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# 缓存字典，简单实现LRU缓存
cache = {}
cache_size = 100

@app.before_request
def before_request():
    """请求前钩子，记录请求开始时间"""
    g.start_time = time.time()

@app.after_request
def after_request(response):
    """请求后钩子，记录请求处理时间"""
    if hasattr(g, 'start_time'):
        process_time = time.time() - g.start_time
        logger.info(f"Request: {request.method} {request.path} - Status: {response.status} - Time: {process_time:.3f}s")
    return response

@app.route('/')
def index():
    """
    首页
    """
    return render_template('index.html')

@app.route('/recommend', methods=['POST'])
def recommend():
    """
    推荐歌曲API
    """
    try:
        # 验证请求格式
        if not request.is_json:
            return jsonify({
                'error': '请求格式错误，需要JSON格式',
                'status': 'error'
            }), 400
        
        data = request.get_json()
        text = data.get('text', '').strip()
        top_n = data.get('top_n', 10)
        
        # 验证top_n参数
        try:
            top_n = int(top_n)
            if top_n < 1 or top_n > 50:
                top_n = 10  # 默认值
        except (ValueError, TypeError):
            top_n = 10  # 默认值
        
        # 输入验证
        if not text:
            return jsonify({
                'error': '请输入文本内容',
                'status': 'error'
            }), 400
        
        # 检查缓存
        cache_key = f"{text}_{top_n}"
        if cache_key in cache:
            logger.info(f"使用缓存结果，key: {cache_key}")
            return jsonify({
                'recommendations': cache[cache_key],
                'status': 'success',
                'from_cache': True
            })
        
        # 获取推荐结果
        recommendations = song_recommender.recommend_songs(text, top_n)
        
        # 缓存结果
        if len(cache) >= cache_size:
            # 简单LRU：移除最早的缓存
            oldest_key = next(iter(cache))
            del cache[oldest_key]
        cache[cache_key] = recommendations
        
        return jsonify({
            'recommendations': recommendations,
            'status': 'success',
            'from_cache': False,
            'count': len(recommendations)
        })
    except ValueError as e:
        logger.warning(f"ValueError: {str(e)}")
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), 400
    except Exception as e:
        logger.error(f"Internal Error: {str(e)}", exc_info=True)
        return jsonify({
            'error': '服务器内部错误，请稍后重试',
            'status': 'error'
        }), 500

@app.route('/random-recommend', methods=['GET'])
def random_recommend():
    """
    随机推荐歌曲API
    """
    try:
        # 获取top_n参数
        top_n = request.args.get('top_n', 10)
        
        # 验证top_n参数
        try:
            top_n = int(top_n)
            if top_n < 1 or top_n > 50:
                top_n = 10  # 默认值
        except (ValueError, TypeError):
            top_n = 10  # 默认值
        
        # 检查缓存
        cache_key = f"random_{top_n}"
        if cache_key in cache:
            logger.info(f"使用缓存结果，key: {cache_key}")
            return jsonify({
                'recommendations': cache[cache_key],
                'status': 'success',
                'from_cache': True
            })
        
        # 获取随机推荐结果
        recommendations = song_recommender.get_random_songs(top_n)
        
        # 缓存结果（缓存10分钟）
        if len(cache) >= cache_size:
            # 简单LRU：移除最早的缓存
            oldest_key = next(iter(cache))
            del cache[oldest_key]
        cache[cache_key] = recommendations
        
        return jsonify({
            'recommendations': recommendations,
            'status': 'success',
            'from_cache': False,
            'count': len(recommendations)
        })
    except Exception as e:
        logger.error(f"Internal Error: {str(e)}", exc_info=True)
        return jsonify({
            'error': '服务器内部错误，请稍后重试',
            'status': 'error'
        }), 500