# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 在此仓库中工作时提供指导。

## 项目简介

**Claude Counter** 是一个浏览器扩展（同时提供油猴脚本版本），可在 Claude.ai 页面中注入 token 计数显示、缓存计时器，以及会话/每周用量进度条。无构建系统——所有 JavaScript 直接在浏览器中运行，无需打包或转译。

## 无构建/测试基础设施

项目中没有 `package.json`、构建步骤、Linter 或测试套件。直接加载扩展即可：
- **Chrome/Edge**：在 `chrome://extensions` 启用开发者模式，然后"加载已解压的扩展"并指向此目录。
- **Firefox**：通过 `about:debugging` 以临时附加组件方式加载。
- **油猴脚本**：通过 Tampermonkey 或 Violentmonkey 安装 `userscript/claude-counter.user.js`。

## 架构

扩展采用 **内容脚本 + 注入脚本桥接** 模式来拦截 `fetch` 调用（内容脚本本身无法直接做到这一点）。

### 各层结构（加载顺序与 `manifest.json` 一致）

| 层级 | 文件 | 运行上下文 | 职责 |
|---|---|---|---|
| 注入脚本 | `src/injected/bridge.js` | 页面（window） | 包装 `fetch` + `history`；拦截 Claude API 调用；通过 `postMessage` 触发事件 |
| 桥接客户端 | `src/content/bridge-client.js` | 内容脚本 | 提供基于 Promise 的 `postMessage` API，与注入脚本通信 |
| 常量 | `src/content/constants.js` | 内容脚本 | DOM 选择器、token 上限、颜色、缓存窗口时长 |
| 分词器 | `src/vendor/o200k_base.js` | 内容脚本 | 内嵌的 gpt-tokenizer（MIT 协议），提供 `encode()` |
| Token 逻辑 | `src/content/tokens.js` | 内容脚本 | 从会话树构建消息主干，使用 SHA-256 指纹缓存计算 token 数 |
| UI | `src/content/ui.js` | 内容脚本 | `CounterUI` 类——渲染顶栏 token/缓存显示及用量进度条 |
| 主控 | `src/content/main.js` | 内容脚本 | 编排器——状态管理、URL 变化检测、刷新逻辑、1 Hz 时钟 |

### 数据流

1. `bridge.js`（页面上下文）拦截 `fetch` 调用：
   - POST 到 `/completion` 或 `/retry_completion` → 触发 `cc:generation_start`
   - GET `.../chat_conversations/{id}?tree=true` → 触发 `cc:conversation`
   - SSE 事件流 → 解析 `message_limit` → 触发 `cc:message_limit`
2. `bridge-client.js` 通过 `postMessage` 接收上述事件并转发给 `main.js`。
3. `main.js` 调用 `tokens.js` 计算指标，再调用 `CounterUI` 更新 DOM。
4. `CounterUI` 注入两处 UI：**顶栏**（token 计数 + 缓存计时器，位于聊天菜单旁）和**用量行**（会话 + 每周进度条，位于模型选择器下方）。
5. 1 Hz 的 `tick()` 更新倒计时，无需额外网络请求。

### 关键概念

- **Token 缓存**：`tokens.js` 使用 SHA-256 指纹对每条消息的 token 数进行缓存，每次会话更新时只重算被修改的消息。
- **SSE vs `/usage` 接口**：SSE 的 `message_limit` 数据提供未取整的用量分数；`/usage` 接口作为兜底方案在加载时使用。
- **桥接协议**：消息格式为 `{ cc: "ClaudeCounter", type, requestId, kind, payload }`。内容脚本发出请求并得到响应；事件则从注入脚本单向流向内容脚本。
- **主题适配**：`CounterUI` 监听 `data-mode` 属性变化，实时切换亮色/暗色模式下的 CSS 变量。
- **SPA 导航**：`bridge.js` 包装 `history.pushState/replaceState` 以触发 URL 变化事件；`main.js` 在每次导航时重置状态并重新拉取数据。

## 常见任务对应文件

| 任务 | 文件 |
|---|---|
| 修改 token/缓存显示或用量进度条 | `src/content/ui.js` |
| 修改哪些消息计入 token | `src/content/tokens.js` |
| 修改 API 拦截逻辑 | `src/injected/bridge.js` |
| 修改 DOM 选择器（如 Claude.ai 更新了 HTML） | `src/content/constants.js` |
| 修改样式 | `src/styles.css` |
| 新增桥接请求类型 | `src/injected/bridge.js` + `src/content/bridge-client.js` |

## 油猴脚本版本

`userscript/claude-counter.user.js` 是为脚本管理器打包的独立版本。对扩展做功能性修改时，需手动同步更新油猴脚本。
