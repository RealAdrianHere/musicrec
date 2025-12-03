from flask import Flask

app = Flask(__name__)

# 导入路由
from app import routes