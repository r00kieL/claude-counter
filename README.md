# Claude Counter / Claude 计数器

A minimal browser extension that shows token count, cache timer, and usage bars on claude.ai.  
一个极简的浏览器扩展，用于在 `claude.ai` 上显示当前会话的 token 数量、缓存倒计时以及使用情况进度条。

![Claude Counter screenshot](./screenshot.png)

## Features / 功能特性

- **Token count** — Approximate token count for the current conversation, with a mini progress bar against the 200k context limit  
  **Token 计数**：估算当前对话使用的 token 数量，并通过一个迷你进度条显示相对于 200k 上下文上限的大致占比。
- **Cache timer** — Countdown showing how long the conversation remains cached (cheaper to continue)  
  **缓存倒计时**：显示当前会话在 Claude 侧保持缓存状态的剩余时间（在缓存期内继续对话通常更便宜）。
- **Usage bars** — Session (5-hour) and weekly (7-day) usage from Claude's native API, with progress bars and reset countdowns (more accurate than the rounded /usage page)  
  **用量进度条**：基于 Claude 原生 API 的会话用量（5 小时窗口）和周用量（7 天窗口），提供带进度条和重置倒计时的展示，比 Claude 官方 `/usage` 页面四舍五入后的数字更精确。

## Installation / 安装方式

**Chrome / Edge / Chromium**

1. Download [`claude-counter-0.4.2.zip`](../../releases/download/v0.4.2/claude-counter-0.4.2.zip)  
   下载 [`claude-counter-0.4.2.zip`](../../releases/download/v0.4.2/claude-counter-0.4.2.zip)
2. Go to `chrome://extensions` and enable **Developer mode**  
   打开 `chrome://extensions`，启用右上角的 **开发者模式（Developer mode）**
3. Drag and drop the zip onto the page  
   将下载好的 zip 文件直接拖拽到该页面中完成安装

**Firefox**

1. Download [`claude-counter-0.4.2.xpi`](../../releases/download/v0.4.2/claude-counter-0.4.2.xpi)  
   下载 [`claude-counter-0.4.2.xpi`](../../releases/download/v0.4.2/claude-counter-0.4.2.xpi)
2. Drag it into any Firefox window and click **Add**  
   将文件拖入任意一个 Firefox 窗口，然后点击 **添加（Add）** 进行安装

**Userscript / 用户脚本**

1. Install the userscript from [`claude-counter.user.js`](./userscript/claude-counter.user.js)  
   从 [`claude-counter.user.js`](./userscript/claude-counter.user.js) 安装用户脚本（例如通过 Tampermonkey、Violentmonkey 等脚本管理器）。

## How it works / 工作原理

- Intercepts Claude's API responses to read conversation data and usage info  
  拦截 Claude 的 API 响应，从中读取会话数据和用量信息。
- Uses a vendored tokenizer (`o200k_base`) for approximate token counting  
  使用内置的 `o200k_base` 分词器，对文本进行近似 token 计数。
- Uses Claude’s `/usage` plus live SSE `message_limit` data; the SSE provides exact, unrounded utilization fractions, so the progress bars are more accurate than the rounded percentages shown on Claude’s native /usage page  
  结合 Claude 的 `/usage` 接口和实时 SSE `message_limit` 数据来计算用量；SSE 提供的是未四舍五入的精确利用率，所以这里的进度条会比 Claude 官方 `/usage` 页面显示的百分比更准确。
- Watches for DOM changes to inject UI elements as you navigate  
  监听页面 DOM 变化，在你浏览和切换对话时自动将 UI 元素注入到合适的位置。

## Privacy / 隐私说明

- All data stays local — no external servers, no tracking  
  所有数据都只在本地处理——不发送到任何第三方服务器，也不做追踪统计。
- Reads your `lastActiveOrg` cookie to query Claude's `/usage` endpoint  
  仅读取你的 `lastActiveOrg` Cookie，用于向 Claude 的 `/usage` 接口发起查询。
- Makes requests only to `claude.ai`  
  只会向 `claude.ai` 域名发起网络请求。

## Credits / 致谢

- Token counting via [gpt-tokenizer](https://github.com/niieani/gpt-tokenizer) (MIT)  
  Token 计数功能基于 [gpt-tokenizer](https://github.com/niieani/gpt-tokenizer)（MIT 许可）。
- Inspired by [Claude Usage Tracker](https://github.com/lugia19/Claude-Usage-Extension) by lugia19  
  设计灵感部分来源于 lugia19 的 [Claude Usage Tracker](https://github.com/lugia19/Claude-Usage-Extension) 项目。

## License / 许可证

MIT  
本项目使用 MIT 开源许可协议。
