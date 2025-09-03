## 项目简介

这是一个基于 Electron + Vite + Vue 3 的桌面应用模板项目，使用 `@jctaoo/elecrun` 简化主进程与渲染进程的开发与构建，集成了打包（electron-builder）、样式（TailwindCSS）等常用工具。

同时，本项目已内置 MCP（Model Context Protocol）配置，支持通过 `uv` 启动相关 MCP Server 以增强在 IDE（如 Cursor）中的开发体验。

## 主要特性

- **技术栈**: Electron 37、Vite 7、Vue 3、TypeScript、TailwindCSS
- **开发体验**: `elecrun` 一键开发/构建、自动装配 preload、ESM 支持
- **打包发布**: electron-builder（Windows/macOS/Linux）
- **MCP 支持**: 通过 `uvx` 一键拉起 MCP Server（如 `mcp-feedback-enhanced`、`serena`）

---

## 开发环境准备

### 1) 安装 Node.js 与包管理器

- 安装 Node.js LTS（建议 18+，推荐 20+）
  - Windows: 前往 Node.js 官网下载安装包
- 启用或安装 Yarn（任选其一）
  - 使用 Corepack（推荐，Node.js 16.10+ 自带）：
    - 终端执行：`corepack enable`，然后 `corepack prepare yarn@stable --activate`
  - 或使用 npm 全局安装：`npm i -g yarn`

### 2) 安装 uv（MCP 所需）

`uv` 是 Astral 出品的超快 Python 包与环境管理器，`uvx` 可直接运行 Python 包中的可执行程序，本项目的 MCP Server 即通过 `uvx` 启动。

- Windows PowerShell（建议以普通用户身份执行）：
  - 允许脚本（仅当前会话）：
    ```powershell
    Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force
    ```
  - 安装 uv：
    ```powershell
    iwr -useb https://astral.sh/uv/install.ps1 | iex
    ```
- macOS / Linux：
  ```bash
  curl -LsSf https://astral.sh/uv/install.sh | sh
  ```

安装完成后重启终端，验证：
```bash
uv --version
uvx --help
```

如需为 `uv` 配置代理（在公司/校园网络环境下常见），可设置环境变量 `HTTP_PROXY`/`HTTPS_PROXY`。

---

## MCP（Model Context Protocol）配置与使用

本项目包含以下 MCP 配置文件：

- `.cursor/mcp.json`（供 Cursor IDE 自动读取）
  - `mcp-feedback-enhanced`：通过 `uvx mcp-feedback-enhanced@latest` 启动
  - `context7`：通过 SSE URL 连接
- `.mcp.json`（供其他 MCP 客户端读取）
  - `serena`：通过 `uvx --from git+https://github.com/oraios/serena serena start-mcp-server` 启动
  - `context7`：通过 SSE URL 连接

### 在 Cursor 中使用

1. 确保已安装 `uv` 并可在终端执行 `uvx`。
2. 把本仓库克隆到本地后，Cursor 会自动读取项目根目录下的 `.cursor/mcp.json` 并按需启动/连接 MCP Servers。
3. 在 Cursor 设置中开启 MCP（若版本需要：Settings → Features → Enable MCP Servers）。

### 手动验证 MCP Server 是否可启动

- 反馈增强服务：
  ```bash
  uvx mcp-feedback-enhanced@latest --help
  ```
- Serena（IDE 助手上下文）：
  ```bash
  uvx --from git+https://github.com/oraios/serena serena start-mcp-server --context ide-assistant --project ./
  ```

如命令可正常显示帮助或启动日志，说明 `uv` 与 MCP 运行环境正常。

---

## 快速开始（开发、构建、打包）

在项目根目录执行以下命令。

### 安装依赖
```bash
yarn install
```

### 开发调试
```bash
yarn dev
```
将自动启动 Electron 主进程与 Vite 开发服务器。首次运行可能会自动安装调试扩展（如 Vue DevTools）。

### 预览生产构建
```bash
yarn preview
```
该命令会先构建再以生产模式启动 Electron，方便验证打包前的运行效果。

### 构建（不打包安装程序）
```bash
yarn build
```

### 打包安装程序
以下命令会调用 electron-builder，生成对应平台的安装包（见 `electron-builder.yml` 配置）。

```bash
# 全平台（需在对应平台打包或使用 CI）：
yarn pack:all

# 仅 Windows：
yarn pack:win

# 仅 macOS：
yarn pack:mac

# 仅 Linux：
yarn pack:linux
```

打包产物默认位于 `dist/` 或 `release/`（具体以 electron-builder 的配置与日志为准）。

---

## 项目结构（简要）

- `src/main`：Electron 主进程代码（窗口、服务、预加载等）
- `src/renderer`：渲染进程（Vue 3 前端应用）
- `src/services`：通用业务服务（如用户会话）
- `app/`：构建后应用产物目录（开发/构建流程生成）
- `electron-builder.yml`：打包配置
- `.cursor/mcp.json`、`.mcp.json`：MCP 服务器配置

---

## 常见问题（Windows）

- PowerShell 执行策略导致脚本无法运行
  - 可在当前会话临时放开：
    ```powershell
    Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force
    ```

- `uvx` 运行缓慢或连接失败
  - 配置代理：设置 `HTTP_PROXY` / `HTTPS_PROXY`
  - 切换网络或稍后重试

- 依赖安装失败
  - 使用国内源镜像（可选）：
    ```bash
    npm config set registry https://registry.npmmirror.com
    yarn config set registry https://registry.npmmirror.com
    ```