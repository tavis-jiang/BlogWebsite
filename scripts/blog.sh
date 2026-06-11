#!/bin/bash
# Blog - Quick blog post creator
# Usage: blog ["filename"] ["title"] or just 'blog' for interactive mode

# Change to blog directory FIRST (from anywhere)
BLOG_DIR="/Volumes/External/files/BlogWebsite"
cd "$BLOG_DIR"

OBSIDIAN_POSTS_DIR="/Volumes/External/files/Notes/obsidian /post"
TEMPLATE_FILE="$BLOG_DIR/obsidian/templates/post-template.md"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}📝 Blog Post Creator${NC}\n"
echo -e "📂 Working in: $(pwd)\n"

# Get filename and title
if [ -n "$1" ]; then
    FILENAME_INPUT="$1"
    # Remove .md extension if provided
    FILENAME_INPUT="${FILENAME_INPUT%.md}"
else
    echo "${YELLOW}Name your file (no spaces, use hyphens):${NC}"
    echo "  Example: my-first-post"
    read -p "Filename: " FILENAME_INPUT
fi

# Validate filename
if [ -z "$FILENAME_INPUT" ]; then
    echo -e "${YELLOW}❌ Filename is required!${NC}"
    exit 1
fi

# Clean up filename (lowercase, replace spaces/special chars with hyphens)
FILENAME=$(echo "$FILENAME_INPUT" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/-*$//' | sed 's/^-*//')

FULL_FILENAME="${FILENAME}.md"
FILEPATH="$OBSIDIAN_POSTS_DIR/$FULL_FILENAME"

# Get title
if [ -n "$2" ]; then
    TITLE="$2"
else
    echo ""
    read -p "Post title: " TITLE
fi

# Use filename as title if not provided
if [ -z "$TITLE" ]; then
    # Convert hyphens to spaces and capitalize words
    TITLE=$(echo "$FILENAME" | sed 's/-/ /g' | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) tolower(substr($i,2))}1')
fi

# Check if file already exists
if [ -f "$FILEPATH" ]; then
    echo -e "${YELLOW}⚠️  File already exists: $FULL_FILENAME${NC}"
    read -p "Open existing file? (Y/n): " OPEN_EXISTING
    if [[ "$OPEN_EXISTING" =~ ^[Nn]$ ]]; then
        exit 0
    fi
else
    # Generate frontmatter
    TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

    # Read template and replace placeholders
    if [ -f "$TEMPLATE_FILE" ]; then
        sed -e "s/{{TITLE}}/$TITLE/g" \
            -e "s/{{DATE}}/$TIMESTAMP/g" \
            "$TEMPLATE_FILE" > "$FILEPATH"
    else
        # Fallback if template doesn't exist
        cat > "$FILEPATH" << EOF
---
title: '$TITLE'
description: ''
publish-date: ${TIMESTAMP}
tags:
draft: false
---

# $TITLE

Write your content here...
EOF
    fi

    echo -e "${GREEN}✅ Created: $FULL_FILENAME${NC}"
fi

# Open in Obsidian
echo -e "${BLUE}🚀 Opening in Obsidian...${NC}"

# Open with Obsidian app explicitly
open -a "Obsidian" "$FILEPATH" 2>&1 || open "$FILEPATH" 2>&1

echo -e "\n${GREEN}✨ Done! Your post is ready to edit.${NC}"
echo -e "📁 File: $FILEPATH"
echo -e "\n${YELLOW}After writing, run:${NC}"
echo -e "  ${BLUE}npm run sync-obsidian${NC}"
echo -e "\n💡 You're now in: $(pwd)"
