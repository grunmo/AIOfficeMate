# Code Wiki · AI办公助手

> 一款本地运行的智能文档管理系统，提供**扫描件处理**、**AI 智能命名分类**、**知识库问答**等核心功能。
> 技术栈：**React 18 + TypeScript + Vite + Tailwind**（前端） + **FastAPI + Python 3.11**（后端） + **SQLite**（本地数据）

---

## 1. 项目概述

| 项目 | 信息 |
| --- | --- |
| 产品名称 | AI 办公助手（AI Office Assistant） |
| 版本 | v0.1.0 |
| 运行形态 | 本地浏览器 + Python 后端服务（可后续打包为桌面应用） |
| 前端 | React 18 + TypeScript 5 + Vite 5 + Tailwind CSS 3.4 + Zustand 4 + Lucide Icons |
| 后端 | FastAPI 0.115 + Python 3.11 + Pillow + OpenCV（可选） |
| 数据库 | SQLite（单机零运维） |
| AI 模式 | ① Mock（内置规则，离线可用） ② OpenAI-compatible LLM（需配置 API Key） |
| 构建产物 | `dist/`（前端静态资源） + `api/`（后端源码直接运行） |

### 1.1 解决的业务痛点

1. **扫描件命名混乱**：批量扫描后生成的 `扫描件001.jpg` 等无意义文件名，手动逐个重命名效率低
2. **目录结构难以维护**：同一类文件散落在不同位置，查找困难
3. **知识沉淀缺失**：文档无法转化为可检索的知识资产，团队内部知识流失

### 1.2 核心功能（MVP）

| 模块 | 功能 |
| --- | --- |
| 文件工作台 | 目录树浏览、文件列表/网格视图、拖拽上传、重命名/移动 |
| 扫描件处理 | 纠偏（OpenCV）、旋转、对比度/亮度调整、一键优化（Pillow） |
| AI 智能命名分类 | 基于文件名/关键词 + 可选 LLM，批量建议文件名与分类目录 |
| 知识库工作区 | 创建知识空间、导入文档、关键词向量化索引、AI 问答 |
| 系统设置 | 工作目录、LLM 配置、命名规则、主题（浅/深色） |

---

## 2. 整体架构

```
┌────────────────────────────── 前端 UI (React + Vite)
│  Layout / Sidebar / Topbar      三栏主框架
│  Dashboard / Files / Scan       核心页面
│  AiPanel / Knowledge / Settings  AI与配置页面
│  Zustand Store + api.ts         状态管理与接口调用
│  Tailwind CSS + Lucide Icons    样式与图标
└──────────────────────────────────────────────────────────
                    ↓ HTTP /api/*
┌──────────────────────────────── 后端 API (FastAPI)
│  routers/                       REST 路由层
│    ├── files.py                 文件管理
│    ├── scan.py                  图像处理
│    ├── ai.py                    AI 命名分类
│    ├── knowledge.py             知识库与问答
│    └── settings.py              配置
│  services/                      业务逻辑层
│    ├── file_service.py
│    ├── scan_service.py
│    ├── ai_service.py            Mock + LLM 双实现
│    ├── knowledge_service.py     SQLite + 内存索引
│    └── settings_service.py
│  config.py / db.py              配置与数据库初始化
└──────────────────────────────────────────────────────────
                    ↓ 读写
┌──────────────────────────────── 本地数据层
│  SQLite: ~/.ai-office-helper/data.db
│    ├── knowledge_spaces         知识空间元信息
│    ├── documents                文档索引
│    ├── doc_chunks               文档段落 + 关键词索引
│    ├── settings                 用户配置键值对
│    └── ai_history               AI 调用历史
│  文件系统: 用户指定工作目录
│    └── 原始文档、扫描件图片
└──────────────────────────────────────────────────────────
                    ↓ 可选
┌──────────────────────────────── 外部服务
│  OpenAI-compatible LLM API      （配置 API Key 后启用）
│  Tesseract / 在线 OCR           （后续可扩展）
└──────────────────────────────────────────────────────────
```

### 2.1 架构关键决策

1. **单机优先**：SQLite 替代 PostgreSQL，无需额外服务，方便部署到个人电脑
2. **AI 抽象**：`ai_service.py` 提供 Mock（规则）+ LLM（调用远程）两种实现，可切换
3. **路径穿越防护**：所有文件操作先 `resolve_relative` 再 `ensure_within_work_dir` 校验
4. **前端无状态**：页面组件调用统一的 `api.ts` 工具函数，Zustand 仅管理全局 UI 状态
5. **构建体积小**：React 单页应用打包后 ~300KB（gzip ~80KB）

---

## 3. 目录结构

```
/workspace/                           项目根目录
├── package.json                      前端依赖
├── tsconfig.json / tsconfig.node.json  TypeScript 配置
├── vite.config.ts                    Vite 配置 (代理 /api → :8000)
├── tailwind.config.js                Tailwind 自定义颜色
├── postcss.config.js
├── index.html                        HTML 入口
├── requirements.txt                  后端 Python 依赖
├── .env.example                      环境变量模板
├── .gitignore
├── README.md                         使用与启动指南
├── CODE_WIKI.md                      本文件：代码知识库
│
├── src/                              前端源码
│   ├── main.tsx                      应用入口
│   ├── App.tsx                       路由容器
│   ├── index.css                     Tailwind + 全局样式 + 动画
│   ├── types/
│   │   └── api.ts                    后端接口的 TypeScript 类型定义
│   ├── utils/
│   │   └── api.ts                    fetch 封装（/api/* 基础调用）
│   ├── store/
│   │   ├── useSettings.ts            配置状态（工作目录、主题、LLM）
│   │   └── useToast.ts               通知状态
│   ├── components/
│   │   ├── Layout.tsx                三栏主容器
│   │   ├── Sidebar.tsx               左侧导航栏
│   │   ├── Topbar.tsx                顶部面包屑 + 主题切换
│   │   ├── ToastContainer.tsx        右上角通知容器
│   │   ├── FileExplorer.tsx          文件浏览器组件（树 + 列表/网格）
│   │   └── AiPanel.tsx               右侧 AI 建议面板
│   └── pages/
│       ├── Dashboard.tsx             仪表盘（数据卡片 + 快捷入口）
│       ├── Files.tsx                 文件工作台
│       ├── Scan.tsx                  扫描件处理
│       ├── AiPanel.tsx               AI 智能命名分类（批量表格）
│       ├── Knowledge.tsx             知识空间 + 文档 + 问答对话
│       └── Settings.tsx              系统设置（分区 Tab）
│
└── api/                              后端源码（Python 包）
    ├── __init__.py
    ├── main.py                       FastAPI 入口（CORS + 挂载路由）
    ├── config.py                     工作目录/环境变量解析
    ├── db.py                         SQLite 初始化与连接管理
    ├── routers/
    │   ├── __init__.py
    │   ├── files.py                  文件浏览/重命名/移动
    │   ├── scan.py                   图像处理
    │   ├── ai.py                     AI 命名分类
    │   ├── knowledge.py              知识空间与问答
    │   └── settings.py               配置读写
    └── services/
        ├── __init__.py
        ├── file_service.py           文件操作（路径穿越防护）
        ├── scan_service.py           Pillow/OpenCV 图像处理
        ├── ai_service.py             AI 建议（Mock + LLM 双实现）
        ├── knowledge_service.py      知识空间/索引/问答
        └── settings_service.py       配置持久化

```

---

## 4. 主要模块职责

### 4.1 前端模块

| 模块/文件 | 职责 | 关键入口 |
| --- | --- | --- |
| `main.tsx` | 挂载 React 应用到 `#root` | `ReactDOM.createRoot(...).render(<App />)` |
| `App.tsx` | 使用 `createBrowserRouter` 定义 6 个路由，外层 Layout | `/`, `/files`, `/scan`, `/ai`, `/knowledge`, `/settings` |
| `components/Layout.tsx` | 三栏主容器，响应式，读取 `useSettings` 主题 | `Layout(props: { children })` |
| `components/Sidebar.tsx` | 左侧导航栏：6 个菜单项 + Lucide 图标 | 导航到不同 `pages/` |
| `components/FileExplorer.tsx` | 目录树 + 文件列表/网格 + 上传，调用 `/api/files` | `GET /api/files/tree`, `/api/files/list` |
| `components/AiPanel.tsx` | 右侧浮动面板，显示 AI 建议名/分类/置信度，呼吸光晕动画 | 显示 `AiSuggestion` 类型 |
| `pages/Dashboard.tsx` | 首页仪表盘，4 张渐变数据卡片 + 最近文件 + 3 个快捷入口 | 调用后端健康检查与统计（可扩展） |
| `pages/Scan.tsx` | 图像处理工具：滑块、角度输入、纠偏/优化按钮 | `POST /api/scan/enhance` |
| `pages/AiPanel.tsx` | 批量文件表格 + AI 分析/应用操作 | `POST /api/ai/analyze` + `POST /api/files/rename` |
| `pages/Knowledge.tsx` | 知识空间卡片 + 文档网格 + 对话气泡输入 | `/api/knowledge/*` 系列接口 |
| `pages/Settings.tsx` | 分区 Tab 表单：常规/模型/命名规则/关于 | `GET / PUT /api/settings` |
| `store/useSettings.ts` | Zustand store，保存工作目录、主题、LLM 配置 | `useSettings.getState()` |
| `store/useToast.ts` | Zustand store，右上角通知 | `addToast("已保存", "success")` |
| `utils/api.ts` | `apiGet`, `apiPost`, `apiPut`, `apiDelete`，统一 JSON 解析与错误处理 | 供所有页面组件调用 |

### 4.2 后端模块

| 模块/文件 | 职责 | 关键入口 |
| --- | --- | --- |
| `main.py` | FastAPI 应用入口，挂载 5 个 router，启用 CORS，启动日志 | `uvicorn api.main:app --port 8000` |
| `config.py` | 读取环境变量，解析工作目录，路径穿越防护工具函数 | `get_work_dir()`, `resolve_relative()`, `ensure_within_work_dir()` |
| `db.py` | 在 `~/.ai-office-helper/data.db` 创建 SQLite 连接，自动建表，线程隔离 | `get_db_conn()`, `new_db_conn()` |
| `routers/files.py` | 文件浏览/重命名/移动 API | `GET /api/files/tree`, `/list`, `POST /api/files/rename`, `/move` |
| `routers/scan.py` | 扫描件图像处理 API | `POST /api/scan/enhance` |
| `routers/ai.py` | AI 命名分类 API，兼容字符串数组或对象数组 | `GET /api/ai/providers`, `POST /api/ai/analyze` |
| `routers/knowledge.py` | 知识空间 CRUD、导入文档、AI 问答，`spaceId` 兼容字符串与数字 | `/api/knowledge/spaces`, `/import`, `/chat` |
| `routers/settings.py` | 配置读写 API | `GET / PUT /api/settings` |
| `services/file_service.py` | 路径遍历、文件元信息读取、安全重命名/移动 | `list_tree()`, `list_files()`, `rename_file()`, `move_file()` |
| `services/scan_service.py` | Pillow 调整对比度/亮度/旋转，可选 OpenCV 纠偏（若不可用优雅降级） | `enhance_image(input_path, params)` |
| `services/ai_service.py` | Mock 模式：基于文件扩展名 + 关键词规则生成中文建议；LLM 模式：httpx 调用 OpenAI 兼容接口 | `analyze_files()`, `list_providers()` |
| `services/knowledge_service.py` | 知识空间 CRUD、文档段落切分（按 `\n\s*\n`）、关键词向量化索引（InMemoryIndex）、Mock 问答 | `create_space()`, `import_documents()`, `chat(space_id, question)` |
| `services/settings_service.py` | settings 表的 key-value 读写 | `get_settings()`, `update_settings()` |

---

## 5. 关键类与函数说明

### 5.1 前端核心类型（`src/types/api.ts`）

| 类型 | 字段 | 说明 |
| --- | --- | --- |
| `FileItem` | `path, name, isDir, size, mtime, ext?` | 文件/目录信息 |
| `AiSuggestion` | `file, suggestedName, suggestedCategory, confidence, reason` | AI 对单个文件的建议 |
| `KnowledgeSpace` | `id, name, description, docCount, createdAt` | 知识空间 |
| `KnowledgeDocument` | `id, spaceId, title, filePath, createdAt` | 文档条目 |
| `ChatMessage` | `role: 'user'\|'assistant', content, sources?` | 问答消息 |
| `Settings` | `workDir, llm.provider/model/apiKey/baseUrl, namingTemplate, theme` | 设置 |
| `EnhanceRequest` | `filePath, deskew?, rotate?, contrast?, brightness?` | 图像处理参数 |

### 5.2 前端核心组件

#### `AiPanel.tsx`

| 函数 | 签名 | 说明 |
| --- | --- | --- |
| `AiPanel` | `props: { suggestion?: AiSuggestion \| null, onApply?: () => void }` | 右侧浮动 AI 建议面板组件，带 `animate-pulse` 呼吸光晕 |
| `useSettings().workDir` |  | 读取当前工作目录，显示在面包屑中 |

#### `FileExplorer.tsx`

| 函数 | 签名 | 说明 |
| --- | --- | --- |
| `FileExplorer` | `props: { onSelectFile?: (f: FileItem) => void }` | 交互式文件浏览器 |
| `loadTree()` | `async () => void` | 调用 `/api/files/tree` 加载目录树 |
| `loadFiles(path)` | `async (string) => void` | 调用 `/api/files/list?path=...` 加载当前目录文件 |
| `toggleViewMode()` | `() => void` | 切换网格/列表视图 |

### 5.3 后端核心服务（Python）

#### `api.services.file_service.list_files(dir_path, recursive=False)`

- 输入：目录路径（相对工作目录）
- 输出：`list[dict]`，每个 dict 包含 `path, name, isDir, size, mtime, ext`
- 关键约束：`ensure_within_work_dir` 检查防止路径穿越

#### `api.services.scan_service.enhance_image(input_path, params)`

- 参数：`params = { deskew: bool, rotate: float, contrast: float (0.5-2.0), brightness: float (0.5-2.0) }`
- 流程：Pillow `ImageEnhance` → 若可用且需要则 OpenCV 霍夫变换纠偏 → 保存到同名文件加 `_enhanced` 后缀
- 异常处理：捕获所有图像处理异常，返回优雅的错误信息与已应用的操作列表

#### `api.services.ai_service.analyze_files(files, mode="simple", categories=None)`

- 类型：`async def`
- 输入：`files: list[dict]`（含 `path/name/size`），可选分类白名单
- 输出：`list[dict]`，每个元素为 `{ file, suggestedName, suggestedCategory, confidence, reason }`
- Mock 规则：基于扩展名映射分类（`.jpg/.png` → 图片扫描件；`.pdf` → 合同/文档；`.xlsx` → 财务；`.docx` → 行政/合同），结合文件名关键词（合同/发票/报告等）；置信度 0.65–0.95
- LLM 规则：构造 system prompt，将文件信息与可选分类白名单打包发送到配置的 OpenAI 兼容端点，解析 JSON 结果

#### `api.services.knowledge_service.KnowledgeService`

| 方法 | 说明 |
| --- | --- |
| `list_spaces()` | 列出所有知识空间 |
| `create_space(name, description)` | 创建（name 唯一），返回带新 id 的 dict |
| `delete_space(space_id)` | 删除空间（级联删除 documents + doc_chunks） |
| `import_documents(space_id, files)` | 读取本地文件 → 段落切分 → 存入 doc_chunks → 构建内存关键词索引 |
| `list_documents(space_id)` | 列出该空间下的所有文档 |
| `chat(space_id, question)` | 关键词召回 top 3 段落 → 构造回答 + 引用来源（Mock） |

#### `InMemoryIndex`（知识服务的内部类）

| 方法 | 说明 |
| --- | --- |
| `add_chunk(space_id, doc_id, chunk_id, content)` | 建立 `(space_id, token) → [chunk_id]` 倒排索引 |
| `search(space_id, query, top_k=3)` | 基于 token 命中打分排序，返回 top 段落 |

### 5.4 数据库表结构

| 表 | 字段 | 说明 |
| --- | --- | --- |
| `knowledge_spaces` | `id INTEGER PK, name TEXT UNIQUE, description TEXT, created_at` | 知识空间元信息 |
| `documents` | `id INTEGER PK, space_id INTEGER, title TEXT, file_path TEXT, created_at` | 文档索引 |
| `doc_chunks` | `id INTEGER PK, doc_id INTEGER, space_id INTEGER, content TEXT` | 段落/关键词索引 |
| `settings` | `key TEXT PK, value TEXT` | 用户配置键值对 |
| `ai_history` | `id INTEGER PK, provider/model/mode/input_text/output_text/created_at` | AI 调用历史 |

---

## 6. 后端 API 列表

| 方法 | 路径 | 请求体 | 说明 |
| --- | --- | --- | --- |
| `GET` | `/api/health` |  | 返回 `{ ok: true, version, workDir }` |
| `GET` | `/api/files/tree` | query: `path=...` | 返回目录树 |
| `GET` | `/api/files/list` | query: `path=...` | 返回当前目录的文件数组 |
| `POST` | `/api/files/rename` | `{ oldPath, newName }` | 重命名文件/目录 |
| `POST` | `/api/files/move` | `{ source, targetDir }` | 移动到目标目录 |
| `POST` | `/api/scan/enhance` | `{ filePath, deskew?, rotate?, contrast?, brightness? }` | 图像处理，返回 `{ outputPath, applied: [...] }` |
| `GET` | `/api/ai/providers` |  | 返回可用 provider 列表与当前选择 |
| `POST` | `/api/ai/analyze` | `{ files: string[], mode?, categories? }` | 批量分析，返回 `{ suggestions: AiSuggestion[] }` |
| `GET` | `/api/knowledge/spaces` |  | 知识空间列表 |
| `POST` | `/api/knowledge/spaces` | `{ name, description? }` | 创建知识空间 |
| `DELETE` | `/api/knowledge/spaces/{id}` |  | 删除知识空间 |
| `GET` | `/api/knowledge/spaces/{id}/documents` |  | 空间内文档列表 |
| `POST` | `/api/knowledge/spaces/{id}/import` | `{ files: [{path, title}] }` | 导入文档到知识空间 |
| `POST` | `/api/knowledge/chat` | `{ spaceId, question }` | 基于知识库的问答 |
| `GET` | `/api/settings` |  | 当前配置 |
| `PUT` | `/api/settings` | 配置 dict | 保存配置到 SQLite |

- Swagger UI：`http://localhost:8000/docs`
- ReDoc：`http://localhost:8000/redoc`

---

## 7. 前端路由

| 路径 | 页面组件 | 说明 |
| --- | --- | --- |
| `/` | `Dashboard` | 首页仪表盘 |
| `/files` | `Files` | 文件工作台 |
| `/scan` | `Scan` | 扫描件处理 |
| `/ai` | `AiPanel` | AI 智能命名分类 |
| `/knowledge` | `Knowledge` | 知识库 |
| `/settings` | `Settings` | 系统设置 |
| 其他 | 重定向到 `/` | 404 默认回首页 |

---

## 8. 依赖关系

### 8.1 前端核心依赖（`package.json`）

| 名称 | 版本 | 用途 |
| --- | --- | --- |
| `react` | `^18.3.1` | UI 框架 |
| `react-dom` | `^18.3.1` | 渲染到 DOM |
| `react-router-dom` | `^6.26.0` | 前端路由 |
| `zustand` | `^4.5.4` | 轻量状态管理 |
| `lucide-react` | `^0.460.0` | 图标库 |
| `@types/node` | `^20.x` | Node 类型声明（`vite.config.ts` 需要） |
| `@types/react` | `^18.3.3` | React 类型声明 |
| `@vitejs/plugin-react` | `^4.3.1` | React 构建插件 |
| `typescript` | `^5.5.3` | TS 编译器 |
| `vite` | `^5.3.5` | 构建工具 / 开发服务器 |
| `tailwindcss` | `^3.4.7` | 原子化 CSS |
| `autoprefixer` | `^10.4.19` | PostCSS 前缀 |

### 8.2 后端核心依赖（`requirements.txt`）

| 名称 | 用途 |
| --- | --- |
| `fastapi` | Web 框架 |
| `uvicorn` | ASGI 服务器 |
| `pydantic` | 请求/响应校验 |
| `httpx` | LLM 异步 HTTP 客户端 |
| `Pillow` | 图像处理 |
| `opencv-python-headless` | 图像纠偏（霍夫变换） |
| `numpy` | 数值运算 |
| `python-multipart` | 上传文件支持 |
| `aiofiles` | 异步文件 IO |
| `python-dotenv` | `.env` 加载 |

### 8.3 模块依赖方向

```
pages → components → store → utils → types
                  ↓
               api.ts → /api/*

routers → services → db + config
         ↓
        file_service / scan_service / ai_service / knowledge_service
```

---

## 9. 配置与环境变量

### 9.1 `.env.example`

| 变量 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- |
| `APP_WORK_DIR` | `~/Documents/ai-office-helper` | 否 | 工作目录（所有文件操作的根） |
| `LLM_PROVIDER` | `mock` | 否 | `mock` 或 `openai` |
| `LLM_MODEL` | `gpt-4o-mini` | 否 | 实际使用的模型名 |
| `LLM_API_KEY` | - | 否 | LLM API Key（仅 provider=openai 时需要） |
| `LLM_BASE_URL` | `https://api.openai.com/v1` | 否 | 兼容端点地址（可换通义/智谱/DeepSeek） |
| `APP_PORT` | `8000` | 否 | 后端服务端口 |

### 9.2 配置持久化

- 运行中：`.env` 作为启动默认值，首次启动即可使用
- 用户修改：在 `pages/Settings.tsx` 修改后，调用 `PUT /api/settings` 保存到 `SQLite.settings` 表
- 迁移性：删除 `~/.ai-office-helper/data.db` 即可重置全部配置与知识空间

---

## 10. 项目运行方式

### 10.1 前置条件

- **Node.js ≥ 20**（前端构建 / 开发服务器）
- **Python ≥ 3.11**（后端）
- **pip**（Python 包管理）

### 10.2 本地快速开始

**1. 克隆项目并进入**

```bash
cd /workspace
```

**2. 安装前端依赖并构建**

```bash
npm install
npm run build      # 生产构建到 dist/
# 或开发模式
npm run dev        # 启动 Vite 开发服务器 (http://localhost:5173)
```

**3. 安装后端依赖**

```bash
pip install -r requirements.txt
```

**4. 启动后端 API**

```bash
# 生产运行
uvicorn api.main:app --port 8000

# 或带热重载
uvicorn api.main:app --reload --port 8000
```

**5. 浏览器访问**

- 前端页面：http://localhost:5173（dev）或打包后的静态资源路径
- 后端 API：http://localhost:8000
- Swagger UI：http://localhost:8000/docs
- ReDoc：http://localhost:8000/redoc

### 10.3 类型检查与测试

```bash
# 前端类型检查
npx tsc --noEmit

# 后端语法检查
python -c "import api.main; print('OK')"
```

### 10.4 首次使用流程

1. 启动后访问首页仪表盘
2. 进入**系统设置**，确认工作目录（默认 `~/Documents/ai-office-helper`）
3. 将扫描件或文档放入工作目录
4. 在**文件工作台**浏览文件
5. 在**AI 智能命名分类**选择文件并运行分析，一键应用建议
6. 在**扫描件处理**中对图像做纠偏/增强
7. 在**知识库**建立知识空间并导入文档，开始问答

---

## 11. 开发规范

### 11.1 分支模型

| 分支 | 用途 |
| --- | --- |
| `main` | 主干，发布节点 |
| `develop` | 集成分支 |
| `feature/<ticket>-<desc>` | 功能开发 |
| `hotfix/<desc>` | 线上修复 |

### 11.2 提交信息（Conventional Commits）

```
feat(knowledge): 支持向量化检索混合关键词召回
fix(scan): 修复大尺寸图片旋转后越界
docs(readme): 补充 Windows 启动说明
refactor(api): 提取路径穿越防护为公共函数
test(ai): 增加 Mock 规则覆盖单元
chore(deps): 升级 fastapi 至 0.115
```

### 11.3 代码风格

| 语言 | 规范 |
| --- | --- |
| TypeScript | 严格模式（`strict: true`），默认启用 noEmit |
| Python | 遵循 PEP 8；使用 `pydantic` 做请求校验 |
| CSS | 使用 Tailwind 原子化类，避免自定义 CSS；全局样式集中在 `index.css` |

### 11.4 Code Review 清单

- [ ] 功能符合需求文档
- [ ] 新增 API 在本 Wiki 第 6 节中更新
- [ ] 无路径穿越、无明文密钥硬编码
- [ ] 前端 TypeScript 类型检查通过
- [ ] 数据库操作使用 `ensure_within_work_dir` 防护
- [ ] 新增/修改过的公共组件在 Wiki 中更新

---

## 12. 安全与合规

- **路径穿越防护**：`api/config.py` 提供 `resolve_relative()` + `ensure_within_work_dir()` 双层检查，所有文件服务调用前必须经过此 gate
- **密钥管理**：`LLM_API_KEY` 仅在 `.env` 或 SQLite 中存储，前端界面以密码框（type=password）显示，不写入前端日志
- **不出网保障**：选择 `provider=mock` 时，完全无任何外部网络请求（除文件系统本地读写外）
- **文件所有权**：文档文件保留在用户工作目录中，不复制到其他路径
- **日志脱敏**：后端日志避免打印完整文件路径与用户内容，错误消息包含最少必要信息

---

## 13. 后续可扩展方向

1. **桌面打包**：使用 Electron 或 Tauri 将前端+后端打包为 `.exe/.dmg` 应用
2. **LLM 流式问答**：当前为同步一次性返回，可改为 SSE/WebSocket 流式输出
3. **全文向量化**：引入 Chroma / Qdrant / pgvector 等本地向量库，提升召回质量
4. **真实 OCR**：对扫描件图片做 OCR（Tesseract 或在线服务），提取文本再交给 AI
5. **团队协作**：多用户共享知识空间，引入权限系统
6. **插件系统**：用户自定义文件分类规则、命名模板、自定义 Provider

---

## 14. 变更历史

| 版本 | 日期 | 作者 | 主要变更 |
| --- | --- | --- | --- |
| `0.1.0` | 2026-06-18 | @trae | 初始化 MVP：文件工作台、扫描件处理、AI 命名分类（Mock+LLM 双实现）、知识库问答、系统设置；前后端联调通过、生产构建验证 |

---

> 🛠 **维护提示**：修改 API、数据模型、配置时，请同步更新本 Wiki 对应章节（第 5/6/9 节）。
