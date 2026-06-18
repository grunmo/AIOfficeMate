#!/usr/bin/env bash
# AI办公助手 - 一键构建脚本 (Linux/macOS)
set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

APP_NAME="AIOfficeHelper"
DIST_DIR="$PROJECT_DIR/dist"
RELEASE_DIR="$PROJECT_DIR/release"

echo "========================================"
echo "  AI办公助手 - 一键构建"
echo "========================================"
echo ""

# 步骤 1: 检查前端依赖并构建
echo "[1/4] 检查前端依赖..."
if [ ! -d "node_modules" ]; then
    echo "  → 安装 npm 依赖..."
    npm install
fi

echo ""
echo "[2/4] 构建前端 (React + Vite)..."
npm run build

if [ ! -f "$DIST_DIR/index.html" ]; then
    echo "  ✗ 前端构建失败: 未找到 $DIST_DIR/index.html"
    exit 1
fi
echo "  ✓ 前端构建完成"

# 步骤 3: 检查 Python 依赖并打包
echo ""
echo "[3/4] 检查 Python 依赖并打包可执行程序..."
if ! python3 -c "import pyinstaller" 2>/dev/null; then
    echo "  → 安装 PyInstaller..."
    pip install --quiet pyinstaller
fi

echo "  → 安装运行时依赖..."
pip install --quiet -r requirements.txt

echo "  → PyInstaller 打包 (单文件模式)..."
pyinstaller --noconfirm --clean --onefile \
    --name "$APP_NAME" \
    --add-data "$DIST_DIR:dist" \
    --add-data "$PROJECT_DIR/CODE_WIKI.md:." \
    --hidden-import uvicorn \
    --hidden-import uvicorn.loops \
    --hidden-import uvicorn.loops.auto \
    --hidden-import uvicorn.protocols \
    --hidden-import uvicorn.protocols.http \
    --hidden-import uvicorn.protocols.http.auto \
    --hidden-import uvicorn.lifespan \
    --hidden-import uvicorn.lifespan.on \
    --hidden-import fastapi \
    --hidden-import starlette \
    --hidden-import PIL \
    --hidden-import PIL.Image \
    --collect-all fastapi \
    --collect-all starlette \
    --collect-all uvicorn \
    "$PROJECT_DIR/run_app.py"

# 步骤 4: 整理发布目录
echo ""
echo "[4/4] 整理发布目录到 release/"
rm -rf "$RELEASE_DIR"
mkdir -p "$RELEASE_DIR"

EXE_PATH="$PROJECT_DIR/dist/$APP_NAME"
if [ ! -f "$EXE_PATH" ]; then
    # PyInstaller 可能把结果放在 build 下的其他位置
    EXE_PATH="$(find "$PROJECT_DIR/dist" -maxdepth 1 -name "$APP_NAME" -type f | head -1)"
fi

if [ -f "$EXE_PATH" ]; then
    cp "$EXE_PATH" "$RELEASE_DIR/$APP_NAME"
    chmod +x "$RELEASE_DIR/$APP_NAME"
    echo "  ✓ 可执行文件: $RELEASE_DIR/$APP_NAME"
else
    echo "  ✗ 未找到可执行文件，打包可能失败"
    exit 1
fi

# 复制前端静态资源到 release（便于分发时无需在内部提取）
cp -r "$DIST_DIR/assets" "$RELEASE_DIR/assets" 2>/dev/null || true
cp "$DIST_DIR/index.html" "$RELEASE_DIR/index.html"

# 生成 release/README.md
cat > "$RELEASE_DIR/README.md" << 'README_EOF'
# AI办公助手 · 发布版本

> 桌面端智能办公系统 — 支持文件整理、扫描件处理、AI智能命名分类、知识库问答

## 快速使用

### 1. 启动程序

双击运行 `AIOfficeHelper`（Linux/macOS） 或 `AIOfficeHelper.exe`（Windows）。
程序会自动在浏览器打开 http://127.0.0.1:9123/

```bash
# Linux/macOS 命令行方式
./AIOfficeHelper

# 自定义端口
APP_PORT=8080 ./AIOfficeHelper

# 不自动打开浏览器
NO_BROWSER=1 ./AIOfficeHelper
```

### 2. 功能页面

- **仪表盘** — 文件统计、最近活动、快速入口
- **文件工作台** — 浏览本地目录、AI 建议分类
- **扫描件处理** — 图像纠偏、旋转、对比度/亮度调节
- **AI 智能命名** — 一键生成规范文件名与分类
- **知识库** — 文档空间管理 + 对话助手问答
- **系统设置** — 工作目录 / AI 模型 / 命名规则

### 3. 工作目录

默认工作目录：
- Linux: `~/Documents/ai-office-helper`
- macOS: `~/Documents/ai-office-helper`
- Windows: `%USERPROFILE%\Documents\ai-office-helper`

可在「系统设置 → 常规」中修改。

### 4. AI 模式切换

默认使用 **Mock 模式**（内置规则引擎，离线可用）。

如需接入真实 LLM：
1. 打开「系统设置 → 模型」
2. 选择 "LLM (OpenAI 兼容)" 模式
3. 填入 API Base URL 和 API Key
4. 配置模型名称（默认 gpt-4o-mini）

## 文件清单

```
release/
├── AIOfficeHelper[.exe]   ← 主程序（单文件）
├── index.html             ← 前端入口（备用）
├── assets/                ← 前端静态资源（备用）
└── README.md              ← 本说明文档
```

## 实际测试数据

以下为程序启动时的可验证信息（Mock 模式）：

| 指标 | 数值 |
|------|------|
| 文件总数 | 128（覆盖 12 个分类） |
| 今日整理 | 18 份 |
| AI 使用次数 | 342 次（本月累计） |
| 知识空间 | 6 个（共 92 篇文档） |

## 从源码构建

```bash
# 克隆并进入项目目录
cd AI办公助手

# 安装依赖
npm install
pip install -r requirements.txt pyinstaller

# 运行一键构建
./build.sh          # Linux/macOS
# 或
build.bat           # Windows
```
README_EOF

echo "  ✓ 前端资源: $RELEASE_DIR/index.html"
echo "  ✓ 说明文档: $RELEASE_DIR/README.md"

# 清理临时构建目录
rm -rf "$PROJECT_DIR/build"

echo ""
echo "========================================"
echo "  ✅ 构建完成！"
echo "========================================"
echo ""
echo "  发布目录: $RELEASE_DIR"
echo "  主程序: $RELEASE_DIR/$APP_NAME"
echo ""
echo "  启动测试:"
echo "    cd $RELEASE_DIR && NO_BROWSER=1 APP_PORT=9123 ./$APP_NAME"
echo ""
echo "  浏览器访问: http://127.0.0.1:9123/"
echo ""
