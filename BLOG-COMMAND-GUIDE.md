# 🚀 Blog Command Guide

## Quick Start

### 1. Setup (One Time)
```bash
cd /Volumes/Files/BlogWebsite
./scripts/setup-alias.sh
source ~/.bashrc  # or ~/.zshrc
```

### 2. Create a New Blog Post

**Interactive mode:**
```bash
blog
# Enter post title when prompted
```

**Quick mode:**
```bash
blog "My Awesome Post"
```

### 3. What Happens

When you run `blog "My Post Title"`:

1. ✅ Creates a new file: `2025-05-01-my-post-title.md`
2. ✅ Adds proper frontmatter with template
3. ✅ Opens Obsidian automatically
4. ✅ You just write!

### 4. Publish Your Post

After writing in Obsidian:
```bash
cd /Volumes/Files/BlogWebsite
npm run sync-obsidian
# Type 'y' to push
```

---

## Complete Workflow Example

```bash
# Step 1: Create post
blog "How I Built My Blog"

# Step 2: Write in Obsidian (auto-opened)
# ... write your content ...

# Step 3: Sync to blog
cd /Volumes/Files/BlogWebsite
npm run sync-obsidian --push

# Step 4: Done! View at http://localhost:4321
```

---

## Available Commands

| Command | Description |
|---------|-------------|
| `blog` | Create post (interactive) |
| `blog "Title"` | Create post with title |
| `npm run sync-obsidian` | Sync posts |
| `npm run sync-obsidian --push` | Sync + push to GitHub |

---

## File Location

Posts are created in:
```
/Volumes/Files/Notes/obsidian /post/
    └── YYYY-MM-DD-your-post-title.md
```

Only this folder syncs to your blog (your other notes are safe!)

---

## Troubleshooting

### "blog: command not found"
Run: `source ~/.bashrc` or restart terminal

### Obsidian doesn't open
- Open Obsidian manually
- Navigate to your post in the `post/` folder

### Where is my post?
Check: `/Volumes/Files/Notes/obsidian /post/`
