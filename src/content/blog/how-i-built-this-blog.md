---
title: 'How I Built This Blog'
description: '记录从零搭建这个博客的全过程——Astro 框架、Obsidian 写作工作流、GitHub Pages 自动部署，以及那些踩过的坑。'
publishDate: '2026-06-11T09:30:00Z'
---

> 搭建一个博客不难，难的是让写博客这件事变得足够简单，简单到你能坚持下去。

## 缘起

去年，我的好友 JerryMain 建议我们每个人都做一个个人网站，用来记录学习和生活。他在 GitHub 上找到了 [Astro Theme Pure](https://github.com/cworld1/astro-theme-pure) 这个模板，我一眼就喜欢上了——简洁、现代、支持暗色模式、有博客系统、有友链页面，正好是我想要的。

于是就有了你现在看到的这个网站：[Tavis Island](https://tavisj.top)。

## 技术选型

### Astro — 静态站点生成器

[Astro](https://astro.build) 是一个现代化的静态站点生成器，它的核心理念是"默认零 JS，按需加载"。对于博客这种内容型网站来说，这意味着一一**极快的加载速度**。

和 Next.js、Gatsby 等框架不同，Astro 在构建时将组件渲染为纯 HTML，只在需要交互的地方注入 JS。这意味着你的博客页面加载速度可以做到极致。

### Astro Theme Pure — 开箱即用的模板

模板本身已经非常完善：

- 首页（头像、简介、技能、项目卡片）
- Blog 页面（带标签和时间线）
- 友链页面
- 关于页面
- 暗色/亮色模式切换
- Waline 评论系统
- 全文搜索（Pagefind）
- RSS 订阅

我只需要改改配置、换换图片、写文章就够了。

### GitHub Pages — 免费托管

一开始我以为用的是 Vercel，后来发现其实是 **GitHub Pages + GitHub Actions**。每次 push 代码到 main 分支，GitHub Actions 会自动：

1. Checkout 代码
2. 安装依赖 (`npm install`)
3. 构建站点 (`npm run build`)
4. 部署到 GitHub Pages

完全免费，不需要额外配置 CI/CD。

## Obsidian 写作工作流

这是我最满意的部分。之前写博客的流程是：

```
打开编辑器 → 创建文件 → 手写 frontmatter → 写内容 → 复制到博客目录 → 构建 → 部署
```

太繁琐了！我写了几行脚本，把流程简化为了两步：

```bash
blog "my-post"          # 1. 创建文章（自动打开 Obsidian）
npm run sync-obsidian --push  # 2. 同步并发布
```

### 做了什么

**`blog` 命令** — 一个 bash 函数，放在 `.zshrc` 里：
- 在 Obsidian vault 的 `post/` 目录创建 `.md` 文件
- 自动填充 frontmatter 模板（标题、日期、标签）
- 自动打开 Obsidian 定位到新文章

**`sync-obsidian` 脚本** — 一个 Node.js 脚本：
- 扫描 Obsidian 的 `post/` 目录
- 跳过 `draft: true` 的草稿
- 解析 frontmatter，转换为 Astro 博客格式
- 将 Obsidian 的 `[双向链接](/blog/-)` 转换为标准 Markdown 链接
- 复制图片附件到博客目录
- 可选自动 `git commit && git push`

### 为什么用 Obsidian？

- **离线优先**：飞机上、地铁里都能写
- **Markdown 原生**：写博客本来就是 Markdown
- **双向链接**：文章之间可以 `[互相引用](/blog/-)`
- **数据归你**：所有 `.md` 文件都在本地，不受平台限制

## 我的定制

在模板基础上我做了一些改动：

1. **头像 & 图标** — 换上了猫猫头像，favicon 和社交卡片
2. **首页文案** — 改成了自己的简介和技能标签
3. **SJTU Logo** — 把学校 logo 颜色改成了交大红 (#B01020)
4. **源链接** — 指向自己的 GitHub 仓库
5. **友链** — 加上了 JerryMain 和其他朋友的链接

## 踩过的坑

### 1. 构建命令里的类型检查

原模板的 build 命令是：
```json
"build": "astro-pure check && astro check && astro build"
```

`astro check` 做 TypeScript 类型检查，但模板代码本身有一些类型问题。导致 GitHub Actions **每次构建都失败**，文章推上去了但网站就是不更新。

解决方案：把 build 命令改成 `"astro build"`，跳过类型检查。本地开发时单独跑 `npm run check`。

### 2. 路径硬编码

我的硬盘换过一次挂载路径，从 `/Volumes/Files/` 变成了 `/Volumes/External/files/`。所有脚本里的路径都失效了，`blog` 命令直接报错。

教训：能用相对路径就用相对路径，硬编码的路径要记下来（或者写个配置检测脚本）。

### 3. 图片格式

Astro 会优化 `src/assets/` 下的图片并转成 WebP。如果你放了一张 JPEG 但后缀是 `.png`，构建可能会出问题。确保文件格式和扩展名一致。

## 你也可以搭建

如果你也想搭一个类似的博客，大概需要：

1. **Fork** [astro-theme-pure](https://github.com/cworld1/astro-theme-pure) 或直接 clone 我的[仓库](https://github.com/tavis-jiang/BlogWebsite)
2. **修改配置** — `src/site.config.ts` 里改标题、头像、简介、社交链接
3. **启用 GitHub Pages** — Settings → Pages → Source: GitHub Actions
4. **（可选）设置 Obsidian 工作流** — 用 `scripts/setup-alias.sh` 配置 `blog` 命令
5. **写文章** — 在 `obsidian/post/` 下创建 `.md` 文件，然后 `npm run sync-obsidian`

整个过程一个下午就能搞定。之后你只需要专心写作，其余的自动化帮你处理。

## 结语

这个博客的搭建过程让我学到很多——不仅是技术，更重要的是"如何让工具服务于创作"这个思路。

一个好用的博客系统应该让你**感受不到它的存在**：想写就写，写完一条命令发布，其余时间它安静地待在那里。

感谢 JerryMain 的推荐，感谢 Astro Theme Pure 的作者 [cworld1](https://github.com/cworld1)，也感谢看到这里的你。

Happy blogging! 🚀