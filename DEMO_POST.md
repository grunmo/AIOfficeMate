# 【赛道标签】学习工作

# 【标题】【学习工作】AI办公助手 - 一键打包即用的桌面智能办公系统

---

## 一、Demo 简介

**是什么：**
一款基于浏览器访问的桌面端智能办公系统，通过 PyInstaller 打包为单文件可执行程序（双击即可运行，无需安装 Python/Node.js 环境），零配置开箱即用。

**面向谁：**
企业行政人员、财务人员、档案管理员、律师、医生等需要频繁处理纸质文件归档的办公人群。

**主要功能：**

- **仪表盘** — 文件统计、最近活动、快速入口，一屏掌握整体情况
- **文件工作台** — 目录浏览 + AI 自动分类建议 + 文件重命名/移动
- **扫描件处理** — 图像纠偏、旋转、对比度/亮度调节、一键优化
- **AI 智能命名** — 基于内容自动生成规范文件名（如 `2026-06-18_合同_服务协议.pdf`）与分类，批量一键应用
- **知识库** — 多空间文档管理、关键词索引、对话式问答助手
- **系统设置** — 工作目录 / AI 模型（Mock/LLM） / 命名规则 / 关于页面

> 产品截图（6 个页面）：
>
> 1. **仪表盘** — 统计卡片（128 个文件/12 个分类/342 次 AI 调用） + 最近文件列表 + 快速入口
> 2. **文件工作台** — 左侧目录树 + 右侧文件列表 + AI 分类建议与置信度
> 3. **扫描件处理** — 对比度/亮度滑块 + 旋转按钮 + 处理队列状态
> 4. **AI 智能命名** — 原始文件名 → 建议文件名 + 分类 + 置信度 + 批量应用按钮
> 5. **知识库** — 多空间卡片（商务合同库 34 篇/财务报告 18 篇等） + 对话助手
> 6. **系统设置** — 常规/模型/命名规则/关于 Tab 页切换

---

## 二、Demo 创作思路

**灵感来源：**
日常工作中，大量纸质文件需要扫描归档，但扫描后的图片命名随意（"扫描件001.jpg"）、分类混乱，久而久之文件夹变成"黑洞"；同时，这些文档本可以作为 AI 的知识库素材，却因缺乏有效组织而无法利用。

**想解决的问题：**

- 扫描后的文件名无意义，需要手动逐个重命名 → **AI 智能命名** 自动生成规范文件名
- 文件夹层级混乱，同一类文件散落不同位置 → **文件工作台** 提供统一浏览 + AI 分类建议
- 图片扫描时歪斜，需要手动旋转 → **扫描件处理** 一键纠偏 + 旋转
- 大量文档无法转化为可检索的知识资产 → **知识库** 支持文档导入 + 问答

**为什么做这个方向：**
办公场景中的文件整理是刚性需求，市面上的解决方案要么太重（需要部署服务器），要么太轻（只有单一功能）。我们选择"单文件桌面应用"形态，兼顾功能完整性与零运维体验，让非技术用户也能轻松上手。同时内置 Mock 规则引擎（完全离线可用）和 LLM 接口（可选升级），满足不同用户的需求层次。

---

## 三、Demo 体验地址

### ✅ 打包产物已就绪

由于本项目为桌面端应用（单文件可执行程序），适合下载后在本地运行体验。当前 GitHub Release 已提供 **Linux (x86_64)** 版本可直接下载运行。

- **Release 下载地址**：https://github.com/grunmo/AIOfficeMate/releases/tag/v1.0.0
  - `AIOfficeHelper-linux-x86_64`（Linux 可执行文件，119.85 MB，推荐下载）
  - `build.sh`（Linux/macOS 一键构建脚本）
  - `build.bat`（Windows 一键构建脚本）
  - `INSTALL_GUIDE.md`（安装与使用指南）
  - `CODE_WIKI.md`（完整技术文档）
  - `DEMO_POST.md`（发帖模板）

**快速运行（Linux，推荐先体验）：**

```bash
# 1. 下载 Release 中的可执行文件
wget https://github.com/grunmo/AIOfficeMate/releases/download/v1.0.0/AIOfficeHelper-linux-x86_64

# 2. 添加可执行权限并运行
chmod +x AIOfficeHelper-linux-x86_64
./AIOfficeHelper-linux-x86_64
# → 自动打开浏览器访问 http://127.0.0.1:9123/
```

**快速运行（Windows）：**
当前 Release 提供的是 Linux 版本（**PyInstaller 不支持跨平台打包**，Linux 环境无法直接生成 Windows `.exe`）。请在 Windows 电脑上执行以下操作：

```bat
REM 1. clone 仓库或下载源码
git clone https://github.com/grunmo/AIOfficeMate.git
cd AIOfficeMate

REM 2. 执行一键构建脚本
build.bat

REM 3. 运行生成的可执行程序
release\AIOfficeHelper.exe
```

**快速运行（macOS）：**
在 macOS 上执行 `./build.sh` 一键构建即可。

**体验 Mock 模式（无需配置，立即可用）：**
默认使用内置规则引擎，无需配置 API Key，打开即用。打开「系统设置 → 模型」可切换到 LLM 模式并配置真实模型接口。

> 💡 **关于平台版本的重要提示**：
> - **Linux (x86_64)**：当前 Release 已提供，可直接下载运行
> - **Windows**：需在 Windows 电脑上执行 `build.bat` 构建（约 2~5 分钟）
> - **macOS**：需在 Mac 电脑上执行 `./build.sh` 构建

### 📁 源码仓库

- **GitHub/GitLab 等公开仓库地址**：（请填入你的仓库地址）
- **分支**：`main`
- **commit 记录**：完整记录了从零到可执行程序的 TRAE 辅助开发全过程

---

## 四、TRAE 实践过程

### 开发流程总览

本项目从需求分析、架构设计、代码实现到打包部署的完整流程，全部由 TRAE 辅助完成。主要经历了以下阶段：

1. **需求理解与架构规划** — 将产品创意（文档整理 + AI 命名 + 知识库）拆解为前端（React + TypeScript）和后端（FastAPI + SQLite）架构
2. **Code Wiki 生成** — 生成完整的项目技术文档（CODE_WIKI.md），包含架构、模块职责、API 说明
3. **核心功能实现** — 文件管理服务、图像处理服务、AI 命名/分类引擎、知识库服务
4. **前端 UI 构建** — React Router 路由 + Zustand 状态管理 + Tailwind CSS 样式
5. **前后端联调与 API 修复** — 解决前后端模型不匹配问题（spaceId 类型、files 参数格式）
6. **打包部署** — PyInstaller 单文件打包 + 交叉平台构建方案设计

### 关键步骤截图

#### 截图 1：TRAE 生成项目架构规划（前端技术栈选型 + 后端模块划分）

> 此处插入截图：TRAE 对话中展示 React 18 + TypeScript + Vite + Zustand 技术栈分析，以及 FastAPI 服务模块划分（file_service / image_service / ai_service / knowledge_service）的对话截图。

#### 截图 2：TRAE 解决前后端 API 模型不匹配问题

> 此处插入截图：TRAE 发现后端接受 `files: list[FileRef]`，但前端发送 `list[str]`，通过修改后端 API 兼容两种格式，以及 `_parse_space_id` 函数处理类型转换的对话截图。

#### 截图 3：TRAE 完成 PyInstaller 打包配置并成功构建可执行程序

> 此处插入截图：PyInstaller 构建日志显示 `Building EXE from EXE-00.toc completed successfully`，以及通过浏览器访问 `http://127.0.0.1:9123/` 验证仪表盘正常渲染的截图。

#### 截图 4（可选）：TRAE 生成一键构建脚本

> 此处插入截图：TRAE 生成 `build.sh`（Linux/macOS）和 `build.bat`（Windows）一键构建脚本，并展示脚本执行流程的对话截图。

### 关键任务 Session ID

> ⚠️ **请将下方的占位符替换为你自己在 TRAE 中对应会话的 Session ID。** Session ID 是 TRAE 每段对话任务的唯一标识，用于证明作品由 TRAE 开发。请在创作时保留关键任务的对话记录，发帖时双击对话内容复制 Session ID。

- **Session ID 1（需求分析与架构规划）**：`请填入你在 TRAE 中"分析项目并生成 Code Wiki"的对话 Session ID`
- **Session ID 2（核心功能实现与 API 修复）**：`请填入你在 TRAE 中"解决前后端 API 模型不匹配"的对话 Session ID`
- **Session ID 3（打包部署与跨平台构建）**：`请填入你在 TRAE 中"PyInstaller 打包与构建脚本生成"的对话 Session ID`
- **Session ID 4（可选，补充任何关键开发步骤）**：`请填入你在 TRAE 中其他关键对话的 Session ID`

---

## 五、开发心得与经验总结

### 1. 如何让 TRAE 理解你的产品需求

初期不要直接让 TRAE 写代码，而是先用"产品经理"的角色描述清楚：
- **用户是谁**（行政人员、律师等）
- **核心痛点**（扫描件命名混乱、分类困难）
- **预期输出**（规范文件名 + 分类 + 知识库）

这样 TRAE 在设计架构和 API 时会更贴合实际场景，而不是写出过于通用的"玩具代码"。

### 2. 善用 Code Wiki 建立共识

让 TRAE 先生成 `CODE_WIKI.md`，包含：
- 项目整体架构（前端/后端/数据层）
- 关键模块职责边界
- API 设计意图
- 安全设计（路径穿越防护机制）

后续所有开发都在这个基础上展开，避免 AI 在不同会话中产生矛盾的设计。

### 3. 前后端联调的"最后一公里"

在 React + FastAPI 分离架构中，最容易出问题的环节是**类型不匹配**：
- TypeScript 的 `string` vs Python 的 `int`（如 spaceId）
- 请求体的嵌套结构（`list[str]` vs `list[FileRef]`）

解决方案：让 TRAE 在后端 API 中使用 Pydantic 的 `Union` 类型或自定义校验函数兼容多种输入格式，避免逐个修改前端代码。

### 4. 打包阶段的关键坑

- **PyInstaller 资源路径**：在冻结环境（`sys.frozen=True`）下，`__file__` 不再指向源码路径，需要通过 `sys._MEIPASS` 获取嵌入资源目录。本项目通过 `_resource_path()` 函数统一处理开发和打包两种环境。
- **隐藏导入**：FastAPI/uvicorn 的子模块（`uvicorn.loops.auto`、`uvicorn.protocols.http.auto` 等）不会自动被 PyInstaller 探测到，必须显式通过 `--hidden-import` 声明。
- **前端静态资源**：通过 `StaticFiles` 挂载 `dist/` 目录，并配置 `html=True` 支持 SPA 路由（`/`、`/files`、`/ai` 等），确保刷新页面不 404。

---

## 六、已通过的报名帖链接

> 请在此处附上你在 TRAE 创作赛报名通过的社区帖子链接，例如：
>
> 【学习工作】AI办公助手 - 创意报名帖
> https://community.example.com/t/xxx

---

## 附：项目技术栈速览

| 层级 | 技术选型 |
|------|----------|
| 前端框架 | React 18 + TypeScript |
| 前端构建 | Vite 5 |
| 样式 | Tailwind CSS 3 |
| 状态管理 | Zustand |
| 路由 | React Router v6 |
| 后端框架 | FastAPI + Pydantic |
| 数据库 | SQLite（零运维）|
| 图像处理 | Pillow（纠偏/旋转/增强）|
| AI 模式 | Mock 规则引擎（离线）+ OpenAI 兼容 LLM |
| 打包工具 | PyInstaller 6.x（单文件可执行）|
| 图标 | Lucide Icons |

**可执行文件大小**：~120 MB（包含 Python 解释器 + 所有依赖 + 前端静态资源，打包为单一可执行文件）

**构建命令（Linux/macOS）**：`./build.sh`
**构建命令（Windows）**：`build.bat`

---

> 📝 **发帖提示**：
> 1. 将上方【赛道标签】替换为你报名通过的赛道（生活娱乐/学习工作/社会服务/硬件交互）
> 2. 将截图占位符替换为实际截图（至少 3 张）
> 3. 将 Session ID 占位符替换为你在 TRAE 中实际对话的 Session ID
> 4. 将报名帖链接替换为你的实际帖子链接
> 5. 确保 GitHub/GitLab 仓库已设置为公开，或提供下载链接
