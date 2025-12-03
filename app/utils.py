import numpy as np
import pandas as pd
from transformers import AutoTokenizer, AutoModel
import torch
import os
import logging

# 配置日志
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# 加载模型和数据
class SongRecommender:
    def __init__(self):
        # 加载预训练BGE模型
        logger.info("加载BGE模型...")
        self.tokenizer = AutoTokenizer.from_pretrained('BAAI/bge-large-zh-v1.5', cache_dir='./.cache/huggingface')
        self.model = AutoModel.from_pretrained('BAAI/bge-large-zh-v1.5', cache_dir='./.cache/huggingface')
        
        # 设置设备
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        logger.info(f"使用设备: {self.device}")
        self.model.to(self.device)
        self.model.eval()
        
        # 加载预计算的嵌入和歌曲信息
        logger.info("加载歌词嵌入和歌曲信息...")
        self.embeddings = np.load('./data/lyrics_embeddings.npy')
        self.song_info = pd.read_csv('./data/song_info.csv')
        
        # 预处理：计算嵌入向量的范数，用于快速余弦相似度计算
        self.embeddings_norm = np.linalg.norm(self.embeddings, axis=1)
        
        logger.info(f"加载完成，共 {len(self.song_info)} 首歌曲")
        logger.info(f"嵌入形状: {self.embeddings.shape}")
    
    def get_text_embedding(self, text):
        """
        获取文本的BGE嵌入
        """
        inputs = self.tokenizer(
            text,
            return_tensors='pt',
            max_length=512,
            truncation=True,
            padding='max_length'
        )
        
        inputs = {k: v.to(self.device) for k, v in inputs.items()}
        
        with torch.no_grad():
            outputs = self.model(**inputs)
        
        # BGE模型使用最后一层隐藏状态的平均值作为嵌入
        embedding = outputs.last_hidden_state.mean(dim=1).squeeze().cpu().numpy()
        return embedding
    
    def cosine_similarity(self, vec1, vec2, vec2_norm=None):
        """
        计算两个向量的余弦相似度，支持批量计算
        
        Args:
            vec1: 单个向量 (shape: [embedding_dim])
            vec2: 向量矩阵 (shape: [num_vectors, embedding_dim])
            vec2_norm: 预计算的vec2的范数，用于加速计算
        """
        # 计算vec1的范数
        vec1_norm = np.linalg.norm(vec1)
        
        if len(vec2.shape) == 2:
            # 批量计算相似度
            dot_product = np.dot(vec1, vec2.T)
            if vec2_norm is None:
                vec2_norm = np.linalg.norm(vec2, axis=1)
            similarity = dot_product / (vec1_norm * vec2_norm)
            return similarity.flatten()
        else:
            # 单个向量计算
            if vec2_norm is None:
                vec2_norm = np.linalg.norm(vec2)
            return np.dot(vec1, vec2) / (vec1_norm * vec2_norm)
    
    def recommend_songs(self, text, top_n=10):
        """
        根据文本推荐歌曲
        
        Args:
            text: 用户输入的文本
            top_n: 返回的推荐数量
        
        Returns:
            list: 推荐歌曲列表，包含歌名、歌手和相似度
        """
        # 输入验证
        if not text:
            raise ValueError("文本内容不能为空")
        
        # 获取查询文本的嵌入
        query_embedding = self.get_text_embedding(text)
        
        # 计算与所有歌曲的相似度，使用预计算的嵌入范数加速
        similarities = self.cosine_similarity(query_embedding, self.embeddings, self.embeddings_norm)
        
        # 获取Top N结果的索引
        top_indices = np.argsort(similarities)[::-1][:top_n]
        
        # 批量获取推荐歌曲信息，提高效率
        recommendations = []
        for idx in top_indices:
            song = self.song_info.iloc[idx]
            recommendations.append({
                'name': str(song['name']),
                'singer': str(song['singer']),
                'similarity': round(float(similarities[idx]), 3)
            })
        
        return recommendations
    
    def get_random_songs(self, top_n=10):
        """
        获取随机歌曲推荐
        
        Args:
            top_n: 返回的推荐数量
        
        Returns:
            list: 随机歌曲列表，包含歌名、歌手
        """
        # 随机选择歌曲索引
        random_indices = np.random.choice(len(self.song_info), min(top_n, len(self.song_info)), replace=False)
        
        # 获取推荐歌曲信息
        recommendations = []
        for idx in random_indices:
            song = self.song_info.iloc[idx]
            recommendations.append({
                'name': str(song['name']),
                'singer': str(song['singer'])
            })
        
        return recommendations

# 初始化推荐器
song_recommender = SongRecommender()