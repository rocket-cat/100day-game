# 正式部署方案

当前项目是纯前端静态站点，正式部署推荐优先走 Cloudflare Pages。

## 为什么选它

- 不需要后端，也不需要数据库
- 现在项目还没有 Git 仓库，也可以直接部署
- 会得到稳定的 `*.pages.dev` 域名
- 后面可以再绑定你自己的正式域名
- 支持回滚到旧版本

## 当前建议路线

### 方案 A：最省事

Cloudflare Pages Direct Upload

适合当前阶段：你先把游戏稳定分享出去，后面再决定要不要接 Git 自动部署。

### 方案 B：后续升级

等项目进入持续更新阶段，再补 Git 仓库，然后接 Cloudflare Pages Git 自动部署。

### 方案 C：GitHub Pages

如果你准备把当前 `web` 目录直接放进 GitHub 仓库，现在也已经可以走 GitHub Pages。

- 已补好相对路径构建，适合 `https://<user>.github.io/<repo>/`
- 已加入自动部署工作流：`.github/workflows/deploy-pages.yml`
- 推送到 `main` 分支后会自动部署

GitHub Pages 使用步骤：

1. 把当前 `web` 目录初始化成 Git 仓库并推到 GitHub
2. 仓库默认分支使用 `main`
3. 在 GitHub 仓库里进入 `Settings -> Pages`
4. `Source` 选择 `GitHub Actions`
5. 推送一次代码，等待 `Deploy GitHub Pages` 工作流完成
6. 发布后会得到 `https://<你的 GitHub 用户名>.github.io/<仓库名>/`

## 我已经帮你准备好的命令

```powershell
npm run release:cloudflare
```

执行后会自动：

- 构建生产版本
- 做一次剧情结构校验
- 生成可上传目录：`web/.release/cloudflare-pages`

## 正式部署步骤

1. 运行 `npm run release:cloudflare`
2. 打开 Cloudflare 控制台的 Workers & Pages
3. 选择 `Create application`
4. 选择 `Pages`
5. 选择 `Direct Upload`
6. 新建项目名，例如 `j100days`
7. 把 `web/.release/cloudflare-pages` 目录里的内容上传
8. 发布后会得到固定的 `xxx.pages.dev` 地址

## 后续更新版本怎么做

1. 本地改完内容
2. 再跑一次 `npm run release:cloudflare`
3. 在 Cloudflare Pages 里创建一个新部署
4. 上传新的发布目录内容

## 自定义域名

如果你后面买了自己的域名，可以在 Cloudflare Pages 项目里直接绑定。

## 存档说明

当前存档是浏览器本地存档，基于 `localStorage`。

这意味着：

- 玩家不需要注册账号
- 不需要云数据库
- 同一个域名下可以正常续玩
- 如果你以后更换了正式域名，旧域名下的本地存档不会自动迁移过去

所以正式分享前，最好尽早固定正式域名。
