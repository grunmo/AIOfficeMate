# AI 办公助手 (AI Office Assistant)

> 桌面端智能办公系统 — 文件整理 · 扫描件处理 · AI 智能命名分类 · 知识库问答

一款面向企业行政、财务、档案管理人员的智能办公工具，解决「扫描件命名混乱、目录结构难以维护、文档检索效率低、知识沉淀困难」等日常痛点。通过浏览器访问本地服务，可打包为单文件可执行程序分发使用。

---

## ✨ 功能特性

### 核心模块

| 模块 | 说明 |
|------|------|
| **仪表盘** | 文件统计、最近活动、快速入口，一屏掌握整体情况 |
| **文件工作台** | 浏览本地目录、文件上传与管理、AI 自动分类建议 |
| **扫描件处理** | 图像纠偏、旋转、对比度/亮度调节、一键优化 |
| **AI 智能命名** | 基于文件内容自动生成规范文件名与分类，批量应用 |
| **知识库** | 多空间文档管理、关键词索引、对话式问答助手 |
| **系统设置** | 工作目录 / AI 模型 / 命名规则 / 关于页面 |

### 技术亮点

- **单文件可执行**：通过 PyInstaller 打包，双击即可运行，无需安装 Python 和依赖
- **前端资源内置**：前端构建产物嵌入可执行文件，启动时自动提供服务
- **双 AI 模式**：内置规则引擎（Mock 模式，完全离线可用）+ 真实 LLM 接口（OpenAI 兼容）
- **文件操作安全**：所有文件操作均经路径校验，防止路径穿越攻击
- **轻量数据库**：SQLite 零运维，数据文件保存在工作目录
- **深色/浅色主题**：一键切换，贴合办公场景

---

## 🏗️ 技术栈

### 前端

- **React 18** + **TypeScript** — 类型安全的 UI 开发
- **Vite** — 极速构建与热更新
- **Tailwind CSS** — 原子化样式
- **Zustand** — 轻量状态管理
- **React Router** — 单页路由
- **Lucide Icons** — 现代化图标集

### 后端

- **FastAPI** — 高性能异步 Web 框架（自动生成 OpenAPI 文档）
- **Python 3.11+** — 现代化 Python 运行时
- **Pydantic** — 数据验证与模型定义
- **SQLite** — 嵌入式零运维数据库
- **Pillow** — 图像处理（扫描件纠偏、旋转、增强）
- **OpenCV** — 可选（更高级的图像处理功能）
- **httpx** — HTTP 客户端（用于 LLM 调用）

### 构建与部署

- **PyInstaller** — 将 Python 应用打包为单文件可执行程序
- **Cross-platform** — 支持 Windows (.exe) / Linux / macOS

---

## 📂 项目结构

```
AI办公助手/
├── src/                      # 前端 React 源码
│   ├── components/           # UI 组件
│   ├── pages/                # 页面组件（路由）
│   ├── store/                # Zustand 状态管理
│   └── main.tsx              # 入口
├── api/                      # 后端 FastAPI 服务
│   ├── main.py               # 路由注册、中间件、静态资源挂载
│   ├── services/             # 业务逻辑服务
│   │   ├── file_service.py   # 文件管理
│   │   ├── image_service.py  # 图像处理
│   │   ├── ai_service.py     # AI 命名/分类
│   │   └── knowledge_service.py  # 知识库
│   ├── models/               # 数据模型与 SQLite 操作
│   ├── schemas/              # Pydantic 请求/响应模型
│   └── utils/                # 路径安全、配置等工具函数
├── dist/                     # 前端构建产物（npm run build 生成）
├── release/                  # 发布目录（构建脚本生成）
│   ├── AIOfficeHelper[.exe]  # 可执行程序
│   ├── assets/               # 前端静态资源（备用）
│   ├── index.html            # 前端入口（备用）
│   └── README.md             # 发布版说明
├── build.sh                  # Linux/macOS 一键构建脚本
├── build.bat                 # Windows 一键构建脚本
├── AIOfficeHelper.spec       # PyInstaller 配置文件
├── run_app.py                # 可执行程序入口（兼容打包环境）
├── CODE_WIKI.md              # 项目 Code Wiki（完整技术文档）
├── requirements.txt          # Python 依赖清单
├── package.json              # npm 依赖与脚本
├── vite.config.ts            # Vite 构建配置
├── tailwind.config.js        # Tailwind CSS 配置
└── tsconfig.json             # TypeScript 编译配置
```

---

## 🚀 快速开始

### 方式一：从源码运行（开发模式）

#### 前置要求

- **Node.js 18+** — 用于构建前端
- **Python 3.11+** — 用于运行后端
- **npm / pip** — 包管理器

#### 步骤

```bash
# 1. 克隆项目并进入目录
git clone <repo-url>
cd AI办公助手

# 2. 安装前端依赖
npm install

# 3. 安装 Python 依赖
pip install -r requirements.txt

# 4. 构建前端（生成 dist/ 目录）
npm run build

# 5. 启动服务
# 方式 A：直接启动（推荐，前端和后端统一入口）
python run_app.py
# → 浏览器自动打开 http://127.0.0.1:9123/

# 方式 B：开发模式（前端热更新）
# 终端 1: npm run dev      → 前端: http://127.0.0.1:5173/
# 终端 2: uvicorn api.main:app --reload --port 8000
```

### 方式二：打包为可执行程序（推荐发布）

#### Linux / macOS

```bash
cd AI办公助手
./build.sh
```

#### Windows

```cmd
cd AI办公助手
build.bat
```

构建完成后，可执行文件位于 `release/` 目录：

```bash
# 启动（双击或命令行）
cd release
./AIOfficeHelper          # Linux/macOS
# 或
AIOfficeHelper.exe        # Windows
```

---

## ⚙️ 环境变量

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `APP_WORK_DIR` | `~/Documents/ai-office-helper` | 工作目录，所有文件操作的根路径 |
| `APP_PORT` | `9123` | HTTP 服务端口 |
| `NO_BROWSER` | `0` | 设为 `1` 时不自动打开浏览器 |
| `LLM_PROVIDER` | `mock` | AI 模式：`mock` 或 `openai` |
| `LLM_API_KEY` | — | OpenAI 兼容的 API Key（LLM 模式必填） |
| `LLM_BASE_URL` | `https://api.openai.com/v1` | LLM API 基础地址 |
| `LLM_MODEL` | `gpt-4o-mini` | 使用的模型名称 |

### 使用示例

```bash
# 使用自定义端口并接入真实 LLM
LLM_PROVIDER=openai \
LLM_API_KEY=sk-your-key-here \
LLM_MODEL=qwen-plus \
APP_PORT=8080 \
python run_app.py
```

---

## 🌐 API 概览

启动服务后访问 Swagger UI 查看完整 API 文档：

- **Swagger UI**: http://127.0.0.1:9123/docs
- **ReDoc**: http://127.0.0.1:9123/redoc
- **健康检查**: http://127.0.0.1:9123/api/health

### 主要 API

| 方法 | 路径 | 说明 |
|------|------|------|
| `GET` | `/api/health` | 健康检查，返回版本与运行模式 |
| `GET` | `/api/config` | 获取当前配置 |
| `PUT` | `/api/config` | 保存配置 |
| `GET` | `/api/files/list` | 浏览目录（带路径穿越防护） |
| `POST` | `/api/files/rename` | 文件重命名 |
| `POST` | `/api/files/move` | 文件移动 |
| `POST` | `/api/image/correct` | 图像纠偏与增强 |
| `POST` | `/api/ai/suggest-names` | AI 生成命名建议 |
| `GET` | `/api/knowledge/spaces` | 获取知识空间列表 |
| `POST` | `/api/knowledge/spaces` | 创建知识空间 |
| `POST` | `/api/knowledge/ask` | 基于知识库的问答 |

---

## 📖 详细文档

完整的项目 Code Wiki 请查看 [CODE_WIKI.md](CODE_WIKI.md)，包含：

- 项目整体架构详解
- 各模块职责与关键类/函数说明
- 依赖关系与调用图
- API 详细文档与请求/响应示例
- 安全设计与路径穿越防护机制
- 静态资源托管方案
- 打包与部署指南

---

## 🧪 功能验证

程序启动后可通过以下方式验证功能正常：

### 1. 健康检查

```bash
curl http://127.0.0.1:9123/api/health
# 期望输出:
# {"ok":true,"version":"0.1.0","workDir":"...","frozen":true/false}
```

### 2. 页面访问

- 仪表盘 → http://127.0.0.1:9123/
- 文件工作台 → http://127.0.0.1:9123/files
- 扫描件处理 → http://127.0.0.1:9123/scan
- AI 智能命名 → http://127.0.0.1:9123/ai
- 知识库 → http://127.0.0.1:9123/knowledge
- 系统设置 → http://127.0.0.1:9123/settings

### 3. Mock 模式测试数据

| 指标 | 数值 |
|------|------|
| 文件总数 | 128（覆盖 12 个分类） |
| 今日整理 | 18 份 |
| AI 使用次数 | 342 次（本月累计） |
| 知识空间 | 6 个（共 92 篇文档） |

---

## 📦 发布产物说明

构建脚本生成的 `release/` 目录：

```
release/
├── AIOfficeHelper[.exe]   ← 主程序（单文件，包含前端+后端+依赖）
├── index.html             ← 前端入口（备用：可独立部署前端）
├── assets/                ← 前端静态资源（备用：CSS/JS/图片）
└── README.md              ← 发布版使用说明
```

**分发方式**：将整个 `release/` 目录打包压缩（.zip / .tar.gz），用户解压后双击 `AIOfficeHelper` 或 `AIOfficeHelper.exe` 即可使用。

---

## 🔒 安全说明

- **路径穿越防护**：所有文件 API 均通过 `resolve_relative()` 和 `ensure_within_work_dir()` 双层校验，确保操作范围严格限制在工作目录内
- **无外部网络请求（Mock 模式）**：默认模式下不发起任何外部网络请求，命名与分类基于本地规则引擎
- **LLM 模式**：仅在用户显式切换到 LLM 模式并配置 API Key 后才会向配置的 LLM 服务发送请求，传输内容为文件元数据和用户输入的问题

---

## 📄 License

MIT License

---

## 🆘 常见问题

**Q: 启动后浏览器没有自动打开？**  
A: 可能是环境变量 `NO_BROWSER=1` 或系统无默认浏览器。手动访问 http://127.0.0.1:9123/ 即可。

**Q: 如何修改默认工作目录？**  
A: 两种方式：① 在「系统设置 → 常规」中修改并保存；② 设置环境变量 `APP_WORK_DIR=/custom/path`。

**Q: 打包后的可执行文件启动很慢？**  
A: 首次启动需要解压内嵌的依赖资源到临时目录（几秒到十几秒），这是 PyInstaller 单文件模式的正常行为。后续启动会有缓存加速。

**Q: AI 建议不准确？**  
A: Mock 模式基于关键词规则，适用于常见办公文档。如需更高准确度，可在「系统设置 → 模型」中切换到 LLM 模式并配置真实模型接口。

**Q: Windows 上运行报杀毒软件拦截？**  
A: PyInstaller 生成的可执行文件可能被部分杀毒软件误报。将程序加入白名单或使用源码方式运行即可。
