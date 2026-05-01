---
title: 'My First Blog Post - Complete Workflow Guide'
description: 'A comprehensive guide to writing, syncing, and publishing blog posts from Obsidian to Astro'
publishDate: '2025-05-01T20:00:00Z'
tags:
  - guide
  - workflow
  - obsidian
  - astro
heroImage:
  src: ./my-first-blog-post/thumbnail.jpg
  color: #B01020
---

# Welcome to My Blog!

This is my first blog post, and I'm going to use it to document the complete workflow for publishing posts from Obsidian to my Astro blog.

## What is This Blog Built On?

- **Astro** - A fast, modern static site generator
- **Obsidian** - My favorite markdown editor for writing
- **GitHub** - For version control and hosting
- **Vercel** - For automatic deployment

## The Complete Workflow

### Step 1: Write in Obsidian

1. Open your Obsidian vault at `/Volumes/Files/Notes/obsidian `
2. Create a new markdown file in the vault root (or organize in folders)
3. Add frontmatter at the top:

```yaml
---
title: 'Your Post Title'
description: 'Short description for SEO'
publish-date: 2025-05-01T12:00:00Z
tags: tag1, tag2, tag3
hero-image: ./thumbnail.jpg  # optional - for folder-based posts
hero-color: '#659EB9'        # optional - accent color
draft: false                 # set to true to hide post
---
```

4. Write your content using Markdown syntax

### Step 2: Add Images (Optional)

**For simple posts**: Just reference external URLs:
```markdown
![Alt text](https://example.com/image.jpg)
```

**For posts with local images**:
1. Create a folder with the same name as your post (without .md)
2. Put images in that folder
3. Reference them with relative paths:

```
My Post.md
My Post/
├── thumbnail.jpg
├── screenshot1.png
└── diagram.svg
```

In your markdown:
```markdown
![Thumbnail](./thumbnail.jpg)
![Screenshot](./screenshot1.png)
```

### Step 3: Sync to Blog

Open terminal in your blog directory and run:

```bash
npm run sync-obsidian
```

This will:
- ✅ Scan your Obsidian vault for markdown files
- ✅ Convert Obsidian links `[Note Name](/blog/note-name)` to blog links
- ✅ Copy images to the correct location
- ✅ Format frontmatter for Astro
- ✅ Place files in `src/content/blog/`

### Step 4: Review Changes

Check what was synced:
```bash
git status
```

Preview locally (optional):
```bash
npm run dev
```
Then open http://localhost:4321

### Step 4: Push to GitHub

The sync script will ask:
```
Commit and push now? (y/N):
```

Type `y` and it will:
- Stage all changes
- Commit with message "sync posts from obsidian"
- Push to GitHub
- Trigger automatic deployment

Or push manually:
```bash
git add -A
git commit -m "add new post"
git push origin main
```

### Step 5: View Live

Your post will be live at:
```
https://yourdomain.com/blog/your-post-slug
```

The slug is auto-generated from your filename (lowercase, hyphens instead of spaces).

## Markdown Features Supported

### Basic Formatting
```markdown
**Bold text**
*Italic text*
~~Strikethrough~~
`inline code`
```

### Headers
```markdown
# H1 Title
## H2 Section
### H3 Subsection
```

### Lists
```markdown
- Item 1
- Item 2
  - Nested item

1. First
2. Second
```

### Code Blocks
````markdown
```javascript
console.log('Hello World');
```
````

### Links
```markdown
[Link text](https://example.com)
[Internal Note](/blog/internal-note) - converts to blog link
```

### Images
```markdown
![Alt text](./image.jpg)
```

### Blockquotes
```markdown
> This is a quote
```

### Tables
```markdown
| Column 1 | Column 2 |
|----------|----------|
| Data 1   | Data 2   |
```

### Math (LaTeX)
```markdown
Inline: $E = mc^2$

Block:
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run sync-obsidian` | Sync posts from Obsidian |
| `npm run sync-obsidian --push` | Sync + auto-push to GitHub |
| `npm run new-post` | Create post interactively (non-Obsidian) |
| `npm run delete-post` | Delete posts interactively |
| `npm run dev` | Start development server |
| `npm run build` | Build for production |

## Frontmatter Options

```yaml
---
title: 'Required: Post Title'
description: 'Required: Short description'
publish-date: 'Required: 2025-05-01T00:00:00Z'
tags: 'Optional: comma, separated, tags'
hero-image: 'Optional: ./thumbnail.jpg'
hero-color: 'Optional: #B01020'
language: 'Optional: English or Chinese'
draft: 'Optional: true to hide post'
---
```

## Tips & Best Practices

1. **Use future dates** - Set `publish-date` to a future time to schedule posts
2. **Draft mode** - Set `draft: true` to work on posts without publishing
3. **Tags** - Use consistent tags to organize content
4. **Images** - Use hero images for better visual appeal on post listings
5. **Internal links** - Use `[Note Name](/blog/note-name)` to link between your Obsidian notes

## Troubleshooting

### Post not appearing?
- Check that `draft` is not `true`
- Check that `publish-date` is not in the future
- Run `npm run sync-obsidian` again

### Images not showing?
- For folder-based posts, ensure images are in the same-named folder
- Use relative paths: `./image.jpg` not just `image.jpg`
- Check file extensions match exactly (case-sensitive)

### Sync errors?
- Make sure you're in the blog root directory
- Check that `obsidian/posts` symlink exists: `ls -la obsidian/`
- Verify your Obsidian vault path is correct

## File Structure

```
BlogWebsite/
├── obsidian/posts/          # ← Your Obsidian vault (symlink)
│   ├── My Post.md
│   ├── My Post/
│   │   └── thumbnail.jpg
│   └── Another Post.md
├── src/content/blog/        # ← Synced posts appear here
│   ├── my-post/
│   │   ├── index.md
│   │   └── thumbnail.jpg
│   └── another-post.md
└── ...
```

## Conclusion

This workflow lets me write comfortably in Obsidian while maintaining a fast, modern blog. The key benefits:

- ✅ Write in my favorite editor
- ✅ Use Obsidian's powerful linking features
- ✅ Automatic deployment on push
- ✅ Fast, static site performance

Happy blogging! 🚀