# AI办公助手 · 发布版本

> 桌面端智能办公系统 — 文件整理 · 扫描件处理 · AI 智能命名分类 · 知识库问答

## 快速使用

### 方式一：直接运行（推荐）

双击运行 `AIOfficeHelper`（Linux/macOS）或 `AIOfficeHelper.exe`（Windows）。
程序会自动在默认浏览器中打开 http://127.0.0.1:9123/

```bash
# Linux/macOS 命令行方式
./AIOfficeHelper

# 自定义端口
APP_PORT=8080 ./AIOfficeHelper

# 不自动打开浏览器
NO_BROWSER=1 ./AIOfficeHelper
```

```bat
REM Windows 命令行方式
AIOfficeHelper.exe

REM 自定义端口
set APP_PORT=8080
AIOfficeHelper.exe

REM 不自动打开浏览器
set NO_BROWSER=1
AIOfficeHelper.exe
```

### 方式二：健康检查验证

启动成功后可通过 curl 验证：

```bash
curl http://127.0.0.1:9123/api/health
# 预期返回:
# {"ok":true,"version":"0.1.0","workDir":"...","frozen":true}
```

### 功能页面

- **仪表盘** → http://127.0.0.1:9123/ — 文件统计/最近活动/快速入口
- **文件工作台** → http://127.0.0.1:9123/files — 目录浏览/AI 建议
- **扫描件处理** → http://127.0.0.1:9123/scan — 纠偏/旋转/对比度/亮度
- **AI 智能命名** → http://127.0.0.1:9123/ai — 一键生成规范文件名与分类
- **知识库** → http://127.0.0.1:9123/knowledge — 多空间管理 + 对话式问答
- **系统设置** → http://127.0.0.1:9123/settings — 工作目录/AI 模型/命名规则

### AI 模式切换

默认使用 **Mock 模式**（内置规则引擎，完全离线可用，无需网络）。

如需接入真实 LLM：
1. 打开「系统设置 → 模型」
2. 选择 "LLM (OpenAI 兼容)" 模式
3. 填入 API Base URL 和 API Key
4. 配置模型名称（默认 gpt-4o-mini）

---

## 文件清单

```
release/
├── AIOfficeHelper[.exe]    ← 主程序（单文件，包含前端+后端+依赖）
├── index.html              ← 前端入口（备用：可独立部署前端）
├── assets/                 ← 前端静态资源（备用：CSS/JS）
└── README.md               ← 本说明文档
```

**分发方式**：将整个 `release/` 目录打包压缩（.zip / .tar.gz），用户解压后双击主程序即可使用。

---

## 从源码构建

### 环境要求

- **Node.js 18+**（推荐 LTS 版本）
- **npm**
- **Python 3.11+**
- **pip**

### Linux / macOS

```bash
# 1. 进入项目根目录
cd AI办公助手

# 2. 安装前端依赖
npm install

# 3. 安装 Python 依赖（含 PyInstaller）
pip install -r requirements.txt pyinstaller

# 4. 运行一键构建脚本（推荐）
./build.sh

# 或者手动执行：
npm run build
pyinstaller --noconfirm --clean --onefile \
    --name AIOfficeHelper \
    --add-data "dist:dist" \
    --add-data "CODE_WIKI.md:." \
    --hidden-import uvicorn --hidden-import uvicorn.loops \
    --hidden-import uvicorn.loops.auto --hidden-import uvicorn.protocols \
    --hidden-import uvicorn.protocols.http --hidden-import uvicorn.protocols.http.auto \
    --hidden-import uvicorn.lifespan --hidden-import uvicorn.lifespan.on \
    --hidden-import fastapi --hidden-import starlette \
    --hidden-import PIL --hidden-import PIL.Image \
    --collect-all fastapi --collect-all starlette --collect-all uvicorn \
    run_app.py

# 5. 产物在 release/ 目录
ls -lh release/
```

### Windows（生成 .exe 必须在 Windows 上执行）

```bat
REM 1. 进入项目根目录
cd AI办公助手

REM 2. 安装前端依赖
npm install

REM 3. 安装 Python 依赖（含 PyInstaller）
pip install -r requirements.txt pyinstaller

REM 4. 运行一键构建脚本（推荐）
build.bat

REM 或者手动执行：
npm run build
pyinstaller --noconfirm --clean --onefile ^
    --name AIOfficeHelper ^
    --add-data "dist;dist" ^
    --add-data "CODE_WIKI.md;." ^
    --hidden-import uvicorn --hidden-import uvicorn.loops ^
    --hidden-import uvicorn.loops.auto --hidden-import uvicorn.protocols ^
    --hidden-import uvicorn.protocols.http --hidden-import uvicorn.protocols.http.auto ^
    --hidden-import uvicorn.lifespan --hidden-import uvicorn.lifespan.on ^
    --hidden-import fastapi --hidden-import starlette ^
    --hidden-import PIL --hidden-import PIL.Image ^
    --collect-all fastapi --collect-all starlette --collect-all uvicorn ^
    run_app.py

REM 5. 产物在 release\ 目录
dir release\
```

### 在 Linux 上尝试生成 Windows .exe（备选方案）

由于 PyInstaller 生成的是**本机平台**的可执行文件，**Linux 上直接生成真正的 Windows .exe 需要额外的工具链**。以下方案供参考（需额外安装）：

#### 方案 A：使用 Docker 运行 Windows Python + PyInstaller（需 Docker）

```bash
# 使用 Wine + Python for Windows 的方式（复杂，不推荐用于生产环境）
# 或者直接在 Windows 机器/虚拟机上构建（最简单可靠）

# 推荐的替代方案：用 GitHub Actions 在 Windows runner 上构建
# 参见 .github/workflows/build-windows.yml 示例
```

#### 方案 B：在 Windows 子系统 for Linux (WSL) 上不行

WSL 运行的是 Linux 内核，PyInstaller 在 WSL 中生成的是 Linux ELF 文件，不是 Windows .exe。**必须在原生 Windows 或 Windows 容器中构建**。

#### 方案 C：GitHub Actions 自动化（最推荐用于 CI/CD）

```yaml
# .github/workflows/build-windows.yml 示例
name: Build Windows EXE
on:
  push:
    tags:
      - 'v*'
jobs:
  build-windows:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - run: npm install
      - run: pip install -r requirements.txt pyinstaller
      - run: build.bat
      - uses: actions/upload-artifact@v4
        with:
          name: AIOfficeHelper-Windows
          path: release/
```

---

## 构建产物说明

| 项目 | 值 |
|------|-----|
| 可执行文件大小 | ~120 MB（单文件，内含 Python 解释器 + 依赖 + 前端资源） |
| 前端资源 | 内嵌在可执行文件中，启动时通过 `_MEIPASS` 提取 |
| 运行方式 | 单文件启动，无需安装 Python/Node 等运行环境 |
| 工作目录 | 默认 `~/Documents/ai-office-helper`，可在设置中修改 |
| 监听端口 | 默认 `9123`，可通过 `APP_PORT` 环境变量修改 |
| 首次启动 | 需几秒到十几秒解压内部资源（PyInstaller 单文件模式特性）|

---

## 实际测试数据（Mock 模式）

| 指标 | 数值 |
|------|------|
| 文件总数 | 128（覆盖 12 个分类） |
| 今日整理 | 18 份 |
| AI 使用次数 | 342 次（本月累计） |
| 知识空间 | 6 个（共 92 篇文档） |

---

## 常见问题

**Q: 启动后浏览器没有自动打开？**
A: 可能是 `NO_BROWSER=1` 环境变量或系统无默认浏览器。手动访问 http://127.0.0.1:9123/

**Q: 首次启动很慢（需 5~15 秒）？**
A: 正常。PyInstaller 单文件模式会将内部资源临时解压到系统临时目录，后续启动会快很多。

**Q: 如何修改默认工作目录？**
A: ① 在「系统设置 → 常规」中修改；② 设置环境变量 `APP_WORK_DIR=/custom/path`

**Q: AI 建议不准确？**
A: Mock 模式基于关键词规则，适用于常见办公文档。如需更高准确度，切换到 LLM 模式（「系统设置 → 模型」）

**Q: Windows 上运行报杀毒软件拦截？**
A: PyInstaller 生成的可执行文件可能被部分杀毒软件误报。将程序加入白名单或使用源码方式运行即可。

**Q: Linux/macOS 上双击无法运行？**
A: 需确认文件有可执行权限：`chmod +x AIOfficeHelper`，或右键「属性 → 可执行」。

---

## 版本信息

- **版本**: 0.1.0
- **构建日期**: 2026-06-18
- **前端**: React 18 + TypeScript + Vite
- **后端**: FastAPI + Python 3.11+
- **打包工具**: PyInstaller 6.x
- **License**: MIT
