---
title: '如何使用 Obsidian 写博客并一键发布到个人网站'
description: '详细介绍如何用 Obsidian 作为博客编辑器，通过终端命令将文章同步到 Astro 个人网站并自动部署上线。'
publishDate: '2026-06-11T09:09:03Z'
---

> 用 Obsidian 写博客，一条命令发布上线——这是我最喜欢的写作工作流。

## 为什么用 Obsidian 写博客？

很多人觉得写博客很麻烦：打开 CMS 后台、在网页编辑器里码字、处理图片上传、最后还要部署。整个过程割裂又低效。

[Obsidian](https://obsidian.md) 是一个本地 Markdown 编辑器，它的优势在于：

- **离线优先**：所有文章都是本地 `.md` 文件，不依赖网络
- **极速体验**：打开即写，没有任何加载延迟
- **强大的编辑器**：支持双向链接、标签、图谱视图、插件生态
- **Markdown 原生**：博客本来就是 Markdown 写的，所见即所得
- **数据归属你**：文章文件存在本地，不会因为平台倒闭而丢失

结合一套简单的自动化脚本，你可以在 Obsidian 里写完文章，然后**一条命令同步发布**到个人网站。

## 整体工作流

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│  Obsidian    │  →   │  BlogWebsite │  →   │  GitHub +    │
│  (写作)       │ sync │  (Astro 站点) │ push │  Vercel 部署  │
└──────────────┘      └──────────────┘      └──────────────┘
```

整个流程分三步：

1. **在 Obsidian 里写文章**（本地 Markdown 文件）
2. **运行同步命令**，文章自动转换并复制到博客项目
3. **Push 到 GitHub**，Vercel 自动部署上线

## 第一步：创建新文章

打开终端，输入：

```bash
# 交互式创建（会一步步引导你）
blog

# 或者一行搞定
blog "my-post-slug" "我的文章标题"
```

这背后做了什么？

- 在你指定的 Obsidian vault 的 `post/` 目录下创建 `.md` 文件
- 自动填充 frontmatter（标题、日期、标签等模板内容）
- **自动打开 Obsidian**，直接定位到这篇文章

你不需要手动创建文件、复制模板、配置路径——`blog` 命令一条搞定。

## 第二步：在 Obsidian 中写作

创建文章后 Obsidian 会自动打开，你就可以开始写了。

### Frontmatter 配置

每篇文章顶部的 `---` 之间是 frontmatter，用来配置文章元信息：

```yaml
---
title: '文章标题'
description: '简短描述，会显示在首页和 SEO 摘要中'
publishDate: '2026-06-11T09:00:00Z'
tags:
  - 技术
  - 教程
draft: false    # true = 同步时跳过，不会发布
minutesRead: 8
---
```

几个要点：

- **`draft: true`**：标记为草稿，`sync` 时会自动跳过，不会发布
- **`tags`**：标签会自动同步到博客，用于分类和筛选
- **`description`**：写一个吸引人的摘要，对 SEO 很重要

### Markdown 写作技巧

Obsidian 支持标准 Markdown 和一些扩展语法：

```markdown
## 二级标题

正文内容，**加粗**、*斜体*、`行内代码`。

### 三级标题

- 无序列表
- 第二项

1. 有序列表
2. 第二项

> 引用块，适合放名言或强调

![图片描述](./image.png)

代码块自带语法高亮：

```python
def hello():
    print("Hello, World!")
```
```

### Obsidian 特色功能

**双向链接**：用 `[文章名](/blog/-)` 链接到其他笔记，sync 时会自动转换为博客链接。

```
参考我之前写的 [how-i-built-this-blog](/blog/how-i-built-this-blog) 了解更多细节。
```

同步后会自动变成：`[how-i-built-this-blog](/blog/how-i-built-this-blog)`

**拖拽图片**：直接把图片拖进 Obsidian，放在文章同名的 assets 文件夹里，sync 时图片会自动复制到博客目录。

## 第三步：同步到博客

文章写好后，在终端运行：

```bash
cd /Volumes/External/files/BlogWebsite

# 只同步（从 Obsidian 拉到博客项目）
npm run sync-obsidian
```

这个命令会：

1. 扫描 Obsidian vault 的 `post/` 目录
2. 跳过 `draft: true` 的草稿
3. 解析 frontmatter，转换为博客格式
4. 处理 Obsidian 特有的语法（`[链接](/blog/-)` → 标准 Markdown 链接）
5. 复制图片等附件到博客目录
6. 生成最终的文章文件到 `src/content/blog/`

## 第四步：发布上线

同步完成后，推送到 GitHub 就能自动部署：

```bash
# 同步并直接推送（跳过确认）
npm run sync-obsidian --push

# 或者先同步，再手动推送
npm run sync-obsidian   # 同步
# 确认无误后：
git push origin main     # 推送
```

我的博客托管在 Vercel 上，每次 push 到 main 分支会自动触发构建和部署，**一分钟内就能看到新文章上线**。

## 本地预览（可选）

如果想在发布前预览效果：

```bash
npm run dev
```

这会启动 Astro 开发服务器，打开 `http://localhost:4321` 即可预览。支持热更新，在 Obsidian 里修改保存后浏览器会自动刷新。

## 完整工作流速查

```bash
# 1. 创建文章
blog "new-post" "我的新文章"

# 2. 在 Obsidian 中写作（自动打开）
# ... 写内容、加图片、调格式 ...

# 3. 同步并发布
cd /Volumes/External/files/BlogWebsite
npm run sync-obsidian --push

# 搞定！等一分钟 Vercel 自动部署
```

## 常见问题

### Q: `blog` 命令找不到？

```bash
source ~/.zshrc   # 重新加载 shell 配置
```

### Q: 同步时提示找不到 Obsidian 目录？

检查 `BlogWebsite/obsidian/post/` 是否正确指向了你的 Obsidian vault。可以手动指定路径：

```bash
npm run sync-obsidian -- /path/to/your/vault/post
```

### Q: 文章没有出现在博客上？

检查 frontmatter 里是否写了 `draft: true`——草稿会被跳过。

### Q: 想删除已发布的文章？

```bash
npm run delete-post
```

## 总结

这套工作流的核心思路是**让写作和发布解耦**：

- **Obsidian** 负责纯粹的写作体验——快、离线、专注
- **脚本** 负责格式转换和文件搬运——自动、可靠
- **Astro + Vercel** 负责站点生成和部署——快、免费

你只管写，其余的自动化搞定。这就是我理想的博客工作流。

---

*如果你也想搭建类似的博客系统，可以参考 [Astro](https://astro.build) 官方文档，配合 [Vercel](https://vercel.com) 部署，再加上本文介绍的自动化脚本即可。*