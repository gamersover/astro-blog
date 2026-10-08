# 尘雨尘风 · Astro 博客

独立博客项目，保留原 Hexo 博客的 170 篇 Markdown 原文与文章网址。

## 开发

使用 Node.js 24（`.nvmrc` 与 `package.json` 均已指定）。

```sh
nvm use
npm ci
npm run dev
npm run check
npm run build
npm run verify
```

## 写文章

在 `src/content/posts/` 新建 Markdown 文件：

```yaml
---
title: 文章标题
date: 2026-10-08 12:00:00
tags:
  - 随笔
categories: 文章
draft: true
---
```

- `draft: true` 或 `published: false` 的文章不会出现在页面、搜索、RSS、JSON 接口或站点地图中。发布时去掉草稿标记。
- URL 由日期和文件名生成：`/YYYY/MM/DD/文件名/`。已发表文章请勿随意修改文件名或日期，否则旧链接会变化。
- `<!--more-->` 之前的内容用于摘要，正文支持数学公式、代码高亮、Mermaid、表格和原生 HTML。
- 原有 `{% post_link 文件名 标题 %}` 与诗歌标签在渲染层兼容，不改写原文。
- 专题由 `src/lib/posts.mjs` 管理，心之学按系列顺序展示，其余按时间排列。

## 部署与域名切换

连接 GitHub 仓库 `gamersover/astro-blog` 到独立的 Vercel 项目。每次 push 自动构建，输出 `dist/`，无需另建静态文件仓库。

当前是预览阶段：默认输出 `noindex` 与禁止索引的 robots.txt。旧 `blog.caoqinping.com` 继续由原站提供服务。

验收完成后，才将博客域名绑定到新项目，并配置 `SITE_LIVE=true`、`SITE_URL=https://blog.caoqinping.com`，重新部署。原 Hexo 仓库和部署保留，以便回退。

- RSS：`/rss.xml`
- 全文搜索：`/search/`（静态 JSON 索引，无后端数据库）
- 近期文章数据：`/api/posts.json`（供个人主页使用，避免抓取 HTML）
- 原文章 URL、分类、标签、年月归档与 `/poem/` 均保留。

## 迁移验证

```sh
npm run migrate -- /path/to/hexo-blog
npm run build
npm run verify -- --migration
```

迁移命令不会覆盖已编辑的文章。`migration-manifest.json` 记录原文件 SHA-256，`--migration` 校验原文一致性，仅用于首次迁移验收；后续正常编辑文章请使用不带此参数的 `npm run verify`。

验证覆盖：全部文章路由、全站本地链接、公式解析、Hexo 标签转换、搜索、RSS 和站点地图。`verification-report.json` 是最近一次验证结果。
