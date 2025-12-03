import json
import re
import pandas as pd
from pathlib import Path
import os

def clean_lyrics(lyric_data):
    """
    清洗歌词文本，处理不同格式的歌词数据
    """
    # 处理不同格式的歌词数据
    if isinstance(lyric_data, list):
        # 列表格式，直接合并
        lyric_text = '\n'.join(lyric_data)
    elif isinstance(lyric_data, str):
        # 字符串格式，直接使用
        lyric_text = lyric_data
    else:
        # 其他格式，转换为字符串
        lyric_text = str(lyric_data)
    
    # 移除元数据（如 [00:12.00] 时间戳、作词：xxx）
    # 移除时间戳
    lyric_text = re.sub(r'\[\d{2}:\d{2}(:\d{2})?\.\d{2}\]', '', lyric_text)
    
    # 移除词曲作者信息
    lyric_text = re.sub(r'作词[:：]?\s*[^\n]+', '', lyric_text)
    lyric_text = re.sub(r'作曲[:：]?\s*[^\n]+', '', lyric_text)
    lyric_text = re.sub(r'演唱[:：]?\s*[^\n]+', '', lyric_text)
    lyric_text = re.sub(r'编曲[:：]?\s*[^\n]+', '', lyric_text)
    lyric_text = re.sub(r'混音[:：]?\s*[^\n]+', '', lyric_text)
    lyric_text = re.sub(r'监制[:：]?\s*[^\n]+', '', lyric_text)
    lyric_text = re.sub(r'和声[:：]?\s*[^\n]+', '', lyric_text)
    lyric_text = re.sub(r'制作[:：]?\s*[^\n]+', '', lyric_text)
    
    # 移除曲谱标记
    lyric_text = re.sub(r'《[^》]+》\s*[A-Ga-g]调', '', lyric_text)
    lyric_text = re.sub(r'主歌\d+|副歌\d+|过渡|间奏|前奏|尾奏|桥段|intro|outro|verse|chorus|bridge', '', lyric_text, flags=re.IGNORECASE)
    
    # 移除多余的空行和空格
    lyric_text = re.sub(r'\s+', '\n', lyric_text).strip()
    
    return lyric_text

def main():
    # 定义数据路径
    data_dir = Path('./lyrics_data')
    output_file = Path('./data/clean_lyrics.csv')
    
    # 读取目录中的所有JSON文件
    print(f"扫描目录: {data_dir}")
    lyric_files = []
    
    # 遍历目录，获取所有JSON文件
    for file_path in data_dir.glob('*.json'):
        lyric_files.append(file_path)
    
    # 按文件名排序，确保处理顺序一致
    lyric_files.sort()
    
    print(f"找到 {len(lyric_files)} 个JSON文件")
    
    all_songs = []
    error_count = 0
    
    for file_path in lyric_files:
        print(f"处理文件: {file_path}")
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                songs = json.load(f)
                
                # 确保songs是列表格式
                if isinstance(songs, list):
                    all_songs.extend(songs)
                else:
                    print(f"警告: 文件 {file_path} 内容不是列表格式，跳过")
                    error_count += 1
        except json.JSONDecodeError as e:
            print(f"错误: 文件 {file_path} 解析失败: {e}")
            error_count += 1
        except Exception as e:
            print(f"错误: 处理文件 {file_path} 时出错: {e}")
            error_count += 1
    
    print(f"总共读取到 {len(all_songs)} 首歌曲")
    print(f"处理过程中出现 {error_count} 个错误")
    
    # 清洗数据
    cleaned_songs = []
    for song in all_songs:
        try:
            # 获取歌曲信息，确保字段存在
            name = song.get('name', '')
            singer = song.get('singer', '')
            lyric = song.get('lyric', [])
            
            # 跳过字段缺失的歌曲
            if not name or not singer or not lyric:
                continue
            
            # 过滤掉郑冰冰的歌曲
            if singer.strip() == '郑冰冰':
                continue
            
            # 清洗歌词
            cleaned_lyric = clean_lyrics(lyric)
            
            # 过滤短文本（字数 < 30）
            if len(cleaned_lyric) >= 30:
                cleaned_songs.append({
                    'name': name.strip(),
                    'singer': singer.strip(),
                    'lyric': cleaned_lyric
                })
        except Exception as e:
            print(f"错误: 处理歌曲 {song.get('name', '未知')} 时出错: {e}")
            error_count += 1
    
    print(f"清洗后剩余 {len(cleaned_songs)} 首歌曲")
    
    # 去重处理
    df = pd.DataFrame(cleaned_songs)
    
    # 检查数据完整性
    print(f"数据完整性检查:")
    print(f"- 总记录数: {len(df)}")
    print(f"- 空歌名数量: {df['name'].isnull().sum()}")
    print(f"- 空歌手名数量: {df['singer'].isnull().sum()}")
    print(f"- 空歌词数量: {df['lyric'].isnull().sum()}")
    
    # 去重处理
    df = df.drop_duplicates(subset=['name', 'singer'], keep='first')
    
    print(f"去重后剩余 {len(df)} 首歌曲")
    
    # 保存为CSV
    df.to_csv(output_file, index=False, encoding='utf-8-sig', columns=['name', 'singer', 'lyric'])
    print(f"清洗后的数据已保存到 {output_file}")
    print(f"CSV文件包含列: name, singer, lyric")

if __name__ == "__main__":
    main()