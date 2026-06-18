# AI Office Helper

一个基于 FastAPI 的智能办公助手后端服务，提供文件管理、扫描件处理、AI 智能命名分类和知识空间等功能。

## 功能特性

- **文件管理**：目录浏览、文件重命名、文件移动
- **扫描件处理**：纠偏、旋转、对比度/亮度调整、一键优化
- **AI 智能命名分类**：支持 Mock 模式和真实 LLM 接口（OpenAI 兼容）
- **知识空间**：创建知识空间、导入文档、基于关键词索引的问答
- **配置管理**：统一的配置读写接口

## 技术栈

- FastAPI + Pydantic
- SQLite + sqlite3
- Pillow + OpenCV（图像处理）
- httpx（HTTP 客户端）

## 快速开始

### 1. 安装前端依赖

```bash
npm install
```

### 2. 安装 Python 依赖

```bash
pip install -r requirements.txt
```

### 3. 启动前端开发服务器

```bash
npm run dev
```

### 4. 启动后端服务

```bash
uvicorn api.main:app --reload --port 8000
```

启动后访问：
- API 文档 (Swagger UI): http://127.0.0.1:8000/docs
- API 文档 (ReDoc): http://127.0.0.1:8000/redoc
- 健康检查: http://127.0.0.1:8000/api/health

## 环境变量

复制 `.env.example` 为 `.env` 并按需修改：

| 变量名 | 说明 |
|--------|------|
| `APP_WORK_DIR` | 工作目录，文件操作的根路径 |
| `LLM_PROVIDER` | LLM Provider，`mock` 或 `openai` |
| `LLM_API_KEY` | LLM API Key |
| `LLM_BASE_URL` | LLM Base URL |
| `LLM_MODEL` | 使用的模型名称 |
| `APP_PORT` | 服务端口，默认 8000 |
