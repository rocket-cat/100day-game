# 惊变100天 Web 版

当前版本是手机优先的单人 H5 原型。

## 本地运行

```bash
npm install
npm run dev
```

开发预览默认由 Vite 提供。

## 构建发布包

```bash
npm run build
```

构建产物在 `web/dist`。

## 内容校验

```bash
npm run validate:story
```

会检查：

- 场景跳转目标是否存在
- 动态分支是否能解析
- 词条/伙伴/事件键是否引用了不存在的 ID

分享给别人玩时，不需要安装客户端，只需要把 `dist` 部署到静态托管平台，然后把公开链接发给对方。

适合当前项目的发布方式：

- `Vercel`
- `Cloudflare Pages`
- `Netlify`
- 任意支持静态文件托管的服务器

## 当前已启用的临时公网分享

本轮我已经在当前机器上启用了临时公网试玩。

特点：

- 有公开 `https` 链接
- 可以直接发给别人手机打开
- 不需要安装
- 但依赖这台电脑持续在线
- 关闭本地进程后链接会失效

## 一键重新开启临时分享

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\start-share.ps1
```

脚本会：

- 重新构建
- 启动本地静态服务器
- 建立公网隧道
- 输出新的公网试玩地址

## 关闭临时分享

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\stop-share.ps1
```

## 当前存档方式

- 使用浏览器本地自动存档
- 存档只保存在玩家自己的当前浏览器里
- 不接账号
- 不接云数据库
- 不支持跨设备继承进度

## 剧情内容位置

剧情入口仍然从 `web/src/gameData.js` 导出，但实际内容已经拆到 `web/src/story/`。

当前主要文件：

- `web/src/story/shared.js`
- `web/src/story/content-shared.js`
- `web/src/story/content-prologue.js`
- `web/src/story/content-exploration.js`
- `web/src/story/content-exploration-extra.js`
- `web/src/story/content-survival.js`
- `web/src/story/content-endgame.js`
- `web/src/story/scenes-prologue.js`
- `web/src/story/scenes-exploration.js`
- `web/src/story/scenes-exploration-extra.js`
- `web/src/story/scenes-survival.js`
- `web/src/story/scenes-endgame.js`

每个场景通常包含：

- `theme`
- `speaker`
- `nameplate`
- `dialogues`
- `choices`
- `next`
- `onEnter`

当前已经开始做“内容层 / 行为层”分离：

- `content-*.js` 主要放文本内容，例如 `speaker`、`nameplate`、`dialogues`、`choice.text`、`choice.subtext`
- `scenes-*.js` 主要放流程、条件、跳转、数值效果
- `shared.js` 放通用状态、词条、伙伴、探索入口规则

这意味着后面如果只是改文案，优先改 `content-*.js`；只有改分支逻辑和数值时，才需要进 `scenes-*.js`

## 改剧情时的建议

适合直接改的内容：

- `content-*.js` 里的文本
- `dialogues` 文案
- `speaker`
- `nameplate`
- `choice.text`
- `choice.subtext`
- `toast`
- 数值效果

这些改动通常不会影响旧存档继续读取。

需要谨慎的内容：

- `sceneId`
- `choice.id`
- `flags`
- `addTag`
- `addCompanion`
- `next`

这类字段一旦改名或删除，旧存档可能指向不存在的剧情节点。

## 存档版本

当前前端已经有 `SAVE_VERSION`。

如果后面剧情结构有不兼容调整，例如：

- 删除或重命名场景 ID
- 重做分支结构
- 重做状态字段

就把 `web/src/main.js` 里的 `SAVE_VERSION` 加 `1`。

这样旧存档会自动失效，避免读到坏档。
