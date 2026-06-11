#!/bin/bash
# Setup blog command and auto-cd

echo "📝 Setting up 'blog' command..."

BLOG_SCRIPT="/Volumes/External/files/BlogWebsite/scripts/blog.sh"

# Detect shell
if [ -n "$ZSH_VERSION" ]; then
    SHELL_RC="$HOME/.zshrc"
elif [ -n "$BASH_VERSION" ]; then
    SHELL_RC="$HOME/.bashrc"
else
    SHELL_RC="$HOME/.bashrc"
fi

# Remove old blog alias/function if exists
sed -i '' '/^alias blog=/d' "$SHELL_RC" 2>/dev/null
sed -i '' '/^# Blog command/d' "$SHELL_RC" 2>/dev/null
sed -i '' '/^blog()/,/^}/d' "$SHELL_RC" 2>/dev/null

# Add blog function (function can change directory, alias cannot)
cat >> "$SHELL_RC" << 'EOF'

# Blog command - creates posts and auto-cd to blog directory
blog() {
    # Pass all arguments to the script
    # The script will cd to blog directory and create the post
    "/Volumes/External/files/BlogWebsite/scripts/blog.sh" "$@"
}
EOF

echo "✅ Added 'blog' function to $SHELL_RC"
echo ""
echo "🔄 IMPORTANT: Run this to activate:"
echo "   source $SHELL_RC"
echo ""
echo "💡 Usage:"
echo "   blog                           - Interactive mode"
echo "   blog my-post                   - Quick create with filename"
echo "   blog my-post 'My Post Title'   - Filename + title"
echo ""
echo "   After running, you'll be in /Volumes/External/files/BlogWebsite"
