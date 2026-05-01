---
title: Your Post Title
description: Short description for SEO
publish-date: 2025-05-01T00:00:00Z
tags: tag1, tag2, tag3
hero-image: ./thumbnail.jpg
hero-color: '#659EB9'
draft: false
---

# Your Post Title

Write your content here using Obsidian's markdown syntax.

## Features Supported

- **Bold text** and *italic text*
- [[Internal Link]] to other posts (will auto-convert)
- Code blocks
- Images in same folder

## Adding Images

Put images in a folder with the same name as your post:
```
obsidian/posts/
├── my-post.md
└── my-post/
    ├── image1.png
    └── thumbnail.jpg
```

Then reference them normally:
```markdown
![alt text](image1.png)
```

## Publishing

1. Save this file in `obsidian/posts/`
2. Run: `npm run sync-obsidian`
3. The post will be synced to your blog
