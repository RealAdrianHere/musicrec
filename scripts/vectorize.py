import pandas as pd
import numpy as np
from transformers import AutoTokenizer, AutoModel
import torch
from tqdm import tqdm
import gc

# 批处理大小
batch_size = 100

def get_bge_embedding(text, tokenizer, model, max_length=512):
    """
    获取文本的BGE嵌入向量
    """
    try:
        # 分词
        inputs = tokenizer(
            text,
            return_tensors='pt',
            max_length=max_length,
            truncation=True,
            padding='max_length'
        )
        
        # 将输入张量移动到与模型相同的设备
        device = next(model.parameters()).device
        inputs = {key: value.to(device) for key, value in inputs.items()}
        
        # 生成嵌入
        with torch.no_grad():
            outputs = model(**inputs)
        
        # BGE模型使用最后一层隐藏状态的平均值作为文本表示
        # 先将张量移动到CPU，再转换为numpy数组
        embedding = outputs.last_hidden_state.mean(dim=1).squeeze().cpu().numpy()
        return embedding
    except Exception as e:
        print(f"处理歌词时出错: {e}")
        # 返回零向量作为默认值，BGE-large-zh-v1.5的嵌入维度是1024
        return np.zeros(1024)

def main():
    # 加载清洗后的歌词数据
    print("加载歌词数据...")
    df = pd.read_csv('./data/clean_lyrics.csv')
    total_songs = len(df)
    print(f"共 {total_songs} 首歌曲")
    
    # 加载预训练BGE模型
    print("加载BGE模型...")
    tokenizer = AutoTokenizer.from_pretrained('BAAI/bge-large-zh-v1.5')
    model = AutoModel.from_pretrained('BAAI/bge-large-zh-v1.5')
    
    # 设置设备
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    model.to(device)
    model.eval()
    
    # 生成嵌入 - 分批处理
    print("生成歌词嵌入...")
    embeddings = []
    
    # 分批次处理
    for i in tqdm(range(0, total_songs, batch_size)):
        # 获取当前批次
        batch_df = df.iloc[i:i+batch_size]
        batch_lyrics = batch_df['lyric'].tolist()
        
        # 处理当前批次
        batch_embeddings = []
        for lyric in batch_lyrics:
            embedding = get_bge_embedding(lyric, tokenizer, model)
            batch_embeddings.append(embedding)
        
        # 添加到总嵌入列表
        embeddings.extend(batch_embeddings)
        
        # 释放内存
        del batch_embeddings
        gc.collect()
        
        # 每1000首歌保存一次中间结果
        if (i + batch_size) % 1000 == 0 or (i + batch_size) >= total_songs:
            temp_embeddings = np.array(embeddings)
            np.save('./data/lyrics_embeddings_temp.npy', temp_embeddings)
            print(f"已处理 {i + batch_size} 首歌，临时保存嵌入...")
    
    # 转换为numpy数组
    embeddings = np.array(embeddings)
    
    # 保存嵌入和歌曲信息
    print("保存嵌入和歌曲信息...")
    np.save('./data/lyrics_embeddings.npy', embeddings)
    
    # 保存歌曲信息
    song_info = df[['name', 'singer']].copy()
    song_info.to_csv('./data/song_info.csv', index=False, encoding='utf-8-sig')
    
    print(f"嵌入生成完成，共 {len(embeddings)} 首歌曲")
    print(f"嵌入形状: {embeddings.shape}")
    print("嵌入已保存到 ./data/lyrics_embeddings.npy")
    print("歌曲信息已保存到 ./data/song_info.csv")
    
    # 清理临时文件
    import os
    if os.path.exists('./data/lyrics_embeddings_temp.npy'):
        os.remove('./data/lyrics_embeddings_temp.npy')
        print("临时文件已清理")

if __name__ == "__main__":
    main()