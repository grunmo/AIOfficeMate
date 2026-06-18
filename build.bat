@echo off
REM AI办公助手 - 一键构建脚本 (Windows)
chcp 65001 >nul
setlocal

set PROJECT_DIR=%~dp0
cd /d "%PROJECT_DIR%"

set APP_NAME=AIOfficeHelper
set DIST_DIR=%PROJECT_DIR%dist
set RELEASE_DIR=%PROJECT_DIR%release

echo ========================================
echo   AI办公助手 - 一键构建
echo ========================================
echo.

REM 步骤 1: 检查前端依赖并构建
echo [1/4] 检查前端依赖...
if not exist "node_modules" (
    echo   ^> 安装 npm 依赖...
    call npm install
    if errorlevel 1 (
        echo   x npm install 失败，请检查 Node.js 是否安装
        exit /b 1
    )
)

echo.
echo [2/4] 构建前端 (React + Vite)...
call npm run build
if errorlevel 1 (
    echo   x 前端构建失败
    exit /b 1
)

if not exist "%DIST_DIR%\index.html" (
    echo   x 前端构建失败: 未找到 %DIST_DIR%\index.html
    exit /b 1
)
echo   OK 前端构建完成

REM 步骤 3: 检查 Python 依赖并打包
echo.
echo [3/4] 检查 Python 依赖并打包可执行程序...

python -c "import pyinstaller" 2>nul
if errorlevel 1 (
    echo   ^> 安装 PyInstaller...
    pip install --quiet pyinstaller
)

echo   ^> 安装运行时依赖...
pip install --quiet -r requirements.txt
if errorlevel 1 (
    echo   x Python 依赖安装失败
    exit /b 1
)

echo   ^> PyInstaller 打包 (单文件模式)...
pyinstaller --noconfirm --clean --onefile ^
    --name "%APP_NAME%" ^
    --add-data "dist;dist" ^
    --add-data "CODE_WIKI.md;." ^
    --hidden-import uvicorn ^
    --hidden-import uvicorn.loops ^
    --hidden-import uvicorn.loops.auto ^
    --hidden-import uvicorn.protocols ^
    --hidden-import uvicorn.protocols.http ^
    --hidden-import uvicorn.protocols.http.auto ^
    --hidden-import uvicorn.lifespan ^
    --hidden-import uvicorn.lifespan.on ^
    --hidden-import fastapi ^
    --hidden-import starlette ^
    --hidden-import PIL ^
    --hidden-import PIL.Image ^
    --collect-all fastapi ^
    --collect-all starlette ^
    --collect-all uvicorn ^
    run_app.py

if errorlevel 1 (
    echo   x PyInstaller 打包失败
    exit /b 1
)

REM 步骤 4: 整理发布目录
echo.
echo [4/4] 整理发布目录到 release\

if exist "%RELEASE_DIR%" rmdir /s /q "%RELEASE_DIR%"
mkdir "%RELEASE_DIR%"

set EXE_PATH=%PROJECT_DIR%dist\%APP_NAME%.exe
if not exist "%EXE_PATH%" (
    for /f "delims=" %%f in ('dir /b "%PROJECT_DIR%dist\%APP_NAME%*.exe" 2^>nul') do (
        set EXE_PATH=%PROJECT_DIR%dist\%%f
        goto :found_exe
    )
    echo   x 未找到可执行文件，打包可能失败
    exit /b 1
)

:found_exe
copy /y "%EXE_PATH%" "%RELEASE_DIR%\%APP_NAME%.exe" >nul
echo   OK 可执行文件: %RELEASE_DIR%\%APP_NAME%.exe

REM 复制前端静态资源
if exist "%DIST_DIR%\assets" xcopy /e /i /y "%DIST_DIR%\assets" "%RELEASE_DIR%\assets" >nul
copy /y "%DIST_DIR%\index.html" "%RELEASE_DIR%\index.html" >nul

REM 生成 release\README.md
(
echo # AI办公助手 · 发布版本
echo.
echo ^> 桌面端智能办公系统 — 支持文件整理、扫描件处理、AI智能命名分类、知识库问答
echo.
echo ## 快速使用
echo.
echo ### 1. 启动程序
echo.
echo 双击运行 `AIOfficeHelper.exe`。
echo 程序会自动在浏览器打开 http://127.0.0.1:9123/
echo.
echo ```cmd
echo REM 命令行方式
echo AIOfficeHelper.exe
echo.
echo REM 自定义端口
echo set APP_PORT=8080
echo AIOfficeHelper.exe
echo.
echo REM 不自动打开浏览器
echo set NO_BROWSER=1
echo AIOfficeHelper.exe
echo ```
echo.
echo ### 2. 功能页面
echo.
echo - **仪表盘** — 文件统计、最近活动、快速入口
echo - **文件工作台** — 浏览本地目录、AI 建议分类
echo - **扫描件处理** — 图像纠偏、旋转、对比度/亮度调节
echo - **AI 智能命名** — 一键生成规范文件名与分类
echo - **知识库** — 文档空间管理 + 对话助手问答
echo - **系统设置** — 工作目录 / AI 模型 / 命名规则
echo.
echo ### 3. 工作目录
echo.
echo 默认工作目录：`%%USERPROFILE%%\Documents\ai-office-helper`
echo.
echo 可在「系统设置 → 常规」中修改。
echo.
echo ### 4. AI 模式切换
echo.
echo 默认使用 **Mock 模式**（内置规则引擎，离线可用）。
echo.
echo 如需接入真实 LLM：
echo 1. 打开「系统设置 → 模型」
echo 2. 选择 "LLM (OpenAI 兼容)" 模式
echo 3. 填入 API Base URL 和 API Key
echo 4. 配置模型名称（默认 gpt-4o-mini）
echo.
echo ## 文件清单
echo.
echo ```
echo release\
echo ├── AIOfficeHelper.exe     ← 主程序（单文件）
echo ├── index.html             ← 前端入口（备用）
echo ├── assets\                ← 前端静态资源（备用）
echo └── README.md              ← 本说明文档
echo ```
echo.
echo ## 从源码构建
echo.
echo ```cmd
echo REM 进入项目目录
echo cd AI办公助手
echo.
echo REM 安装依赖
echo npm install
echo pip install -r requirements.txt pyinstaller
echo.
echo REM 运行一键构建
echo build.bat
echo ```
) > "%RELEASE_DIR%\README.md"

echo   OK 前端资源: %RELEASE_DIR%\index.html
echo   OK 说明文档: %RELEASE_DIR%\README.md

REM 清理临时构建目录
if exist "%PROJECT_DIR%build" rmdir /s /q "%PROJECT_DIR%build"

echo.
echo ========================================
echo   OK 构建完成！
echo ========================================
echo.
echo   发布目录: %RELEASE_DIR%
echo   主程序: %RELEASE_DIR%\%APP_NAME%.exe
echo.
echo   启动测试:
echo     cd /d "%RELEASE_DIR%" ^&^& set NO_BROWSER=1 ^&^& set APP_PORT=9123 ^&^& %APP_NAME%.exe
echo.
echo   浏览器访问: http://127.0.0.1:9123/
echo.

endlocal
