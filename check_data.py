import pandas as pd

# 读取CSV文件
df = pd.read_csv('./data/clean_lyrics.csv')

print(f'总歌曲数: {len(df)}')
print(f'不同歌手数: {df["singer"].nunique()}')
print('\n歌手分布前10名:')
print(df["singer"].value_counts().head(10))

# 查看不同歌手的歌曲样本
print('\n不同歌手的歌曲样本:')
for singer in df["singer"].unique()[:5]:
    sample = df[df["singer"] == singer].head(1)
    print(f'\n歌手: {singer}')
    print(f'歌曲: {sample["name"].iloc[0]}')