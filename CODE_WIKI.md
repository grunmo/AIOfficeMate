# Code Wiki · 项目代码知识库

> 说明：当前仓库 `/workspace` 尚未包含业务代码，本 Wiki 以**结构化模板**的形式呈现。后续随着代码落地，请按章节逐步填充具体内容。

---

## 1. 项目概述

| 项 | 内容 |
| --- | --- |
| 项目名称 | _（填写：项目名）_ |
| 项目代号 | _（填写：内部代号，如 `acme-core`）_ |
| 当前版本 | _（填写：语义化版本，如 `v0.1.0`）_ |
| 项目状态 | 🚧 _（填写：Prototype / Alpha / Beta / Production）_ |
| 主要语言 | _（填写：Python / Go / TypeScript / Java / Rust …）_ |
| 主要框架 | _（填写：FastAPI / Spring Boot / Next.js / Gin …）_ |
| 许可协议 | _（填写：MIT / Apache-2.0 / Proprietary …）_ |
| 负责人 / 团队 | _（填写：团队名称或联系人）_ |

### 1.1 业务背景与目标

- _解决的业务痛点是什么？_
- _面向的用户是谁？_
- _业务目标（OKR / KPI）：_

### 1.2 核心能力

| 能力 | 说明 |
| --- | --- |
| _能力 1_ | _一句话描述_ |
| _能力 2_ | _一句话描述_ |
| _能力 3_ | _一句话描述_ |

### 1.3 非目标 / 范围外

- _列出本项目**不做**的事情，避免范围蔓延。_

---

## 2. 整体架构

### 2.1 系统分层

建议采用标准分层架构（可按实际情况调整）：

```
┌──────────────────────────┐
│   Presentation / API     │  对外接口层（REST / GraphQL / gRPC / CLI）
├──────────────────────────┤
│   Application / Service  │  业务编排层（用例、事务边界）
├──────────────────────────┤
│   Domain / Model         │  领域模型层（核心业务规则与实体）
├──────────────────────────┤
│   Infrastructure         │  基础设施层（DB、Cache、Queue、外部服务）
└──────────────────────────┘
```

### 2.2 核心数据流程

```
外部请求
    │
    ▼
[API 路由 / Controller]
    │  校验  →  [DTO / Schema]
    ▼
[Service / Use Case]
    │  业务逻辑
    ▼
[Repository / DAO]
    │  持久化
    ▼
[数据库 / 缓存 / 消息队列]
    │
    ▼
响应 / 异步事件
```

### 2.3 架构关键决策记录（ADR）

| # | 决策 | 背景 | 结论 | 状态 |
| --- | --- | --- | --- | --- |
| 001 | _技术栈选择_ | _…_ | _…_ | ✅ Accepted |
| 002 | _数据库选型_ | _…_ | _…_ | ✅ Accepted |
| 003 | _部署模型_ | _…_ | _…_ | 🟡 Draft |

---

## 3. 目录结构

```
/workspace/
├── README.md                 # 项目简介（当前为空，待补充）
├── CODE_WIKI.md              # 本文件：代码知识库
│
│  —— 以下为建议结构，落地代码时按需创建 ——
│
├── src/                      # 主源码目录
│   ├── app/                  # 应用层入口
│   ├── modules/              # 业务模块
│   ├── infra/                # 基础设施封装
│   └── shared/               # 公共工具
│
├── tests/                    # 测试用例
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── docs/                     # 补充文档
│   ├── api/
│   └── adr/
│
├── scripts/                  # 构建、运维脚本
├── config/                   # 多环境配置
│
├── Makefile                  # 任务入口（可选）
├── Dockerfile                # 镜像构建（可选）
├── docker-compose.yml        # 本地一键拉起（可选）
│
├── package.json / pyproject.toml / go.mod  # 依赖清单
└── .env.example              # 环境变量示例
```

---

## 4. 主要模块职责

| 模块 | 路径 | 职责 | 关键入口 |
| --- | --- | --- | --- |
| _模块 A_ | `src/app/...` | _负责 …_ | _入口类 / 函数_ |
| _模块 B_ | `src/modules/...` | _负责 …_ | _入口类 / 函数_ |
| _模块 C_ | `src/infra/...` | _负责 …_ | _入口类 / 函数_ |
| _模块 D_ | `src/shared/...` | _负责 …_ | _入口类 / 函数_ |

---

## 5. 关键类与函数说明

> 建议每个类/函数按以下模板填写。

### 5.1 类 / 结构体模板

| 项 | 内容 |
| --- | --- |
| 类名 | `ClassName` |
| 所在文件 | `path/to/file.py#L10-L80` |
| 所属模块 | `module.x` |
| 职责定位 | _一句话_ |
| 主要字段 | 字段名 / 类型 / 含义 |
| 主要方法 | 方法名 / 签名 / 用途 |
| 生命周期 | _创建、使用、销毁时机_ |
| 线程安全 | 是 / 否 / 部分 |
| 常见用法 | _调用示例_ |
| 关联类 | `RelatedClassA`、`RelatedClassB` |

### 5.2 函数模板

| 项 | 内容 |
| --- | --- |
| 函数名 | `function_name` |
| 所在文件 | `path/to/file.py#L10-L30` |
| 签名 | `def fn(a: int, b: str) -> bool` |
| 入参 | `a`：…；`b`：… |
| 返回值 | `bool`：… |
| 异常 | `ValueError`：… |
| 副作用 | 读/写 DB、调用外部 API、打印日志等 |
| 幂等性 | 是 / 否 |
| 并发约束 | 线程安全 / 需锁 / 不可重入 |
| 典型调用栈 | `A.fn → B.fn → self.fn` |
| 单测覆盖 | ✅ / ⚠️ / ❌ |

### 5.3 当前仓库已识别清单

> 当前仓库尚无代码，请在首次代码提交后在此维护索引表。

| 类型 | 名称 | 位置 | 一句话说明 |
| --- | --- | --- | --- |
| — | — | — | 待补充 |

---

## 6. 数据模型与数据库

### 6.1 核心实体关系（ER 图占位）

```
[User] 1──* [Order] 1──* [OrderItem] *──1 [Product]
                                    │
                                    └── [Inventory]
```

### 6.2 主要数据表

| 表名 | 主键 | 核心字段 | 用途 | 索引 |
| --- | --- | --- | --- | --- |
| `users` | `id` | `email`, `created_at` | 用户账号 | `uk(email)` |
| `orders` | `id` | `user_id`, `status`, `total` | 订单 | `idx(user_id)` |
| _…_ | _…_ | _…_ | _…_ | _…_ |

### 6.3 存储选型

| 类型 | 产品 | 用途 |
| --- | --- | --- |
| OLTP 关系型 | PostgreSQL / MySQL | 主业务数据 |
| 缓存 | Redis | 热点数据 / Session |
| 消息队列 | Kafka / RabbitMQ | 异步事件 |
| 对象存储 | S3 / OSS | 文件、图片 |

---

## 7. API 接口说明

### 7.1 接口总览

| 方法 | 路径 | 鉴权 | 模块 | 说明 |
| --- | --- | --- | --- | --- |
| `GET`  | `/health`       | 否 | infra   | 健康检查 |
| `POST` | `/api/v1/...`   | 是 | moduleA | _…_ |
| _…_   | _…_            | _…_ | _…_    | _…_ |

### 7.2 单接口模板

| 项 | 内容 |
| --- | --- |
| Method + Path | `POST /api/v1/...` |
| 鉴权 | Bearer Token / API Key / None |
| 请求体 | `{ "field": "..." }` |
| 响应 200 | `{ "data": ... }` |
| 响应 4xx | `{ "code": "...", "message": "..." }` |
| 响应 5xx | `{ "code": "INTERNAL_ERROR" }` |
| 速率限制 | `100 req/min / user` |
| 幂等要求 | 需要 `Idempotency-Key` Header |
| 测试链接 | `curl` 示例 |

---

## 8. 依赖关系

### 8.1 外部依赖清单（示例）

| 名称 | 版本范围 | 用途 | 引入原因 |
| --- | --- | --- | --- |
| `fastapi` | `>=0.110,<0.116` | Web 框架 | 高性能、自动生成 OpenAPI |
| `sqlalchemy` | `>=2.0` | ORM | 类型安全、支持多数据库 |
| `pytest` | `>=8.0` | 测试框架 | 生态成熟 |
| _…_ | _…_ | _…_ | _…_ |

### 8.2 模块依赖方向（示意）

```
app  →  modules  →  shared  →  infra
 │        │
 │        ▼
 └────► domain
```

> 原则：**依赖方向统一向下，避免循环依赖**。

### 8.3 第三方服务

- _外部 REST / gRPC 接口_
- _第三方 SDK（支付、短信、监控等）_
- _CI / CD 集成（GitHub Actions、GitLab CI …）_

---

## 9. 配置与环境变量

### 9.1 多环境划分

| 环境 | 缩写 | 用途 | 地址示例 |
| --- | --- | --- | --- |
| 本地开发 | `dev` | 工程师本地运行 | `localhost:8000` |
| 联调测试 | `test` | 功能与集成测试 | `test.internal` |
| 预发 | `staging` | 灰度前验证 | `stg.internal` |
| 生产 | `prod` | 线上环境 | `api.example.com` |

### 9.2 关键环境变量（`.env.example`）

| 变量名 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- |
| `APP_ENV` | `dev` | 是 | 运行环境 |
| `LOG_LEVEL` | `info` | 否 | 日志级别 |
| `DB_URL` | — | 是 | 数据库连接串 |
| `REDIS_URL` | — | 否 | Redis 连接串 |
| `API_SECRET` | — | 是 | 接口签名密钥（不要提交到 Git） |

---

## 10. 项目运行方式

### 10.1 前置条件

- 语言运行时版本：_（如 Node.js 20、Python 3.11、Go 1.22）_
- 包管理工具：_（如 npm / poetry / pip / pnpm / maven）_
- 本地服务依赖：_（如 Docker、PostgreSQL、Redis）_

### 10.2 本地快速开始（占位）

```bash
# 1) 克隆仓库
git clone <repo-url>
cd /workspace

# 2) 安装依赖
#    Python:  pip install -r requirements.txt  或  poetry install
#    Node:    npm install / pnpm install
#    Go:      go mod download

# 3) 准备环境变量
cp .env.example .env
#    修改 .env 中的敏感项（DB_URL、密钥等）

# 4) 启动依赖服务（若使用 docker-compose）
docker compose up -d

# 5) 运行开发服务器
#    Python/Flask:   flask --app src.main run --debug
#    Node/Next:      npm run dev
#    Go:             go run ./cmd/server

# 6) 访问与验证
curl http://localhost:8000/health
```

### 10.3 运行测试（占位）

```bash
# 单元测试
# npm test        /  pytest tests/unit        /  go test ./...

# 集成测试
# npm run test:int / pytest tests/integration / go test -tags integration ./...

# 覆盖率
# npm run cov     /  pytest --cov=src          /  go test -cover ...
```

### 10.4 构建与打包（占位）

```bash
# 生产构建
# npm run build
# poetry build
# go build -o app ./cmd/server

# Docker 镜像
# docker build -t my-app:latest .
# docker run --rm -p 8000:8000 my-app:latest
```

---

## 11. 部署与运维

### 11.1 部署拓扑

- _容器编排：Kubernetes / Docker Swarm / 裸机？_
- _灰度 / 蓝绿 / 滚动发布策略：_
- _回滚方案：_

### 11.2 监控与告警

| 维度 | 工具 | 关键指标 |
| --- | --- | --- |
| 应用指标 | Prometheus / OpenTelemetry | QPS、P95 延迟、错误率 |
| 日志 | ELK / Loki / CloudWatch | ERROR / WARN 占比 |
| 链路追踪 | Jaeger / Zipkin | 关键调用链耗时 |
| 告警 | Alertmanager / PagerDuty | 错误率 > 1%、延迟 > 1s |

### 11.3 备份与恢复

- _数据库备份策略（频率、保留期）_
- _恢复演练流程与 SLA_

---

## 12. 安全与合规

- **认证与授权**：JWT / OAuth2 / RBAC / ABAC？
- **输入校验**：参数长度、类型、范围、正则白名单
- **SQL 注入 / XSS / CSRF 防护**：ORM 与模板引擎转义
- **敏感信息**：不将密钥、密码提交 Git，使用 `.env` 与 KMS
- **日志脱敏**：手机号、身份证、邮箱等需脱敏或屏蔽
- **合规要求**：GDPR / 等保 / ISO …

---

## 13. 开发规范与工作流

### 13.1 分支模型

| 分支 | 用途 | 合并方向 |
| --- | --- | --- |
| `main` | 主干，随时可发布 | `develop → main`（发布节点） |
| `develop` | 集成分支 | `feature/* → develop` |
| `feature/<ticket>-<desc>` | 功能开发 | `→ develop` |
| `hotfix/<desc>` | 线上修复 | `→ main` 并回合并到 `develop` |

### 13.2 提交信息规范（Conventional Commits）

```
feat(auth): 支持 refresh token 续期
fix(payment): 修复并发下订单状态不一致
docs(readme): 补充快速开始
refactor(user): 抽离 UserService 公共方法
test(cart): 增加购物车边界用例
chore(deps): 升级 fastapi 至 0.115
```

### 13.3 Code Review 清单

- [ ] 功能符合需求与边界条件
- [ ] 命名清晰、模块职责合理
- [ ] 有对应的单元 / 集成测试，覆盖率未下降
- [ ] 无敏感信息与硬编码密钥
- [ ] 日志级别合理，无大量 debug 噪音
- [ ] 新增/修改的公共 API 已在文档（本 Wiki）中更新

### 13.4 代码风格与格式化

| 语言 | 格式化 | 静态检查 | 类型检查 |
| --- | --- | --- | --- |
| Python | `black` / `isort` | `flake8` / `ruff` | `mypy` |
| TypeScript | `prettier` | `eslint` | `tsc --noEmit` |
| Go | `gofmt` / `goimports` | `go vet` | 内置 |
| Java | `google-java-format` | `checkstyle` | 内置 |

---

## 14. 测试策略

### 14.1 分层比例（建议）

```
    ▲
    │  E2E / UI  (少量)
    │
    │  Integration (中等)
    │
    │  Unit (量大)
```

### 14.2 测试金字塔落地

- **单元测试**：覆盖 Service / Domain / 工具函数，目标覆盖率 ≥ 80%
- **集成测试**：覆盖 Repository、外部 API Client、跨模块调用
- **端到端测试**：覆盖关键业务流程（登录 → 下单 → 支付）

### 14.3 质量门禁

- 代码风格检查失败 → 禁止合入
- 单元测试失败 → 禁止合入
- 覆盖率低于阈值（如 75%）→ 禁止合入
- 安全扫描存在高危漏洞 → 禁止合入

---

## 15. 常见问题（FAQ）

| 问题 | 解答 |
| --- | --- |
| _如何新增一个模块？_ | _按目录结构新建 `src/modules/<name>`，在 `app` 中注册路由_ |
| _如何新增一张表？_ | _定义 Model → 生成迁移 → 更新本 Wiki 第 6 节_ |
| _如何配置多环境？_ | _复制 `.env.example` 为 `.env`，按第 9 节说明填写_ |
| _如何排查线上问题？_ | _先看错误日志 → 指标面板 → 链路追踪 → 复现_ |

---

## 16. 变更历史

| 版本 | 日期 | 作者 | 主要变更 |
| --- | --- | --- | --- |
| `0.1.0` | 2026-06-18 | @trae | 初始化 Code Wiki 模板，建立章节骨架 |

---

## 17. 参考资料

- _项目内部：设计文档 / 需求文档 / 架构图链接_
- _外部：官方文档 / 书籍 / 论文 / 博客文章_

---

> 🔖 **维护责任**：每当新增/修改公共 API、数据模型、依赖或部署流程时，请同步更新本 Wiki 相关章节，保持“代码即文档、文档即代码”的一致性。
