#!/usr/bin/env node
// Interactive blog post generator with auto-commit & push
// Usage: node scripts/new-post.js

import { createInterface } from 'readline'
import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'
import { execSync } from 'child_process'

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
})

const question = (prompt) => new Promise(resolve => rl.question(prompt, resolve))

function exec(command, options = {}) {
  try {
    return execSync(command, { encoding: 'utf-8', stdio: 'pipe', ...options })
  } catch (e) {
    console.error(`❌ Command failed: ${command}`)
    console.error(e.stderr || e.message)
    return null
  }
}

async function main() {
  console.log('📝 Create a new blog post\n')

  const title = await question('Title: ')
  if (!title.trim()) {
    console.log('❌ Title is required!')
    rl.close()
    return
  }

  const description = await question('Description: ')
  const tagsInput = await question('Tags (comma-separated): ')
  const useFolder = (await question('Include hero image? (y/N): ')).toLowerCase() === 'y'

  const now = new Date()
  const publishDate = now.toISOString()
  const slug = title.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50)

  const tags = tagsInput
    .split(',')
    .map(t => t.trim())
    .filter(t => t)
    .map(t => `  - ${t}`)
    .join('\n')

  const content = `---
title: '${title}'
description: '${description}'
publishDate: '${publishDate}'${tags ? `\ntags:\n${tags}` : ''}${useFolder ? "\nheroImage: { src: './thumbnail.jpg', color: '#659EB9' }" : ''}
---

Write your content here...
`

  const blogDir = './src/content/blog'
  let createdPath

  if (useFolder) {
    const postDir = join(blogDir, slug)
    mkdirSync(postDir, { recursive: true })
    createdPath = join(postDir, 'index.md')
    writeFileSync(createdPath, content)
    console.log(`\n✅ Created: ${createdPath}`)
    console.log('📸 Add your thumbnail.jpg to this folder')
  } else {
    createdPath = join(blogDir, `${slug}.md`)
    writeFileSync(createdPath, content)
    console.log(`\n✅ Created: ${createdPath}`)
  }

  // Ask about auto-commit and push
  console.log('\n---')
  const shouldCommit = (await question('\nAuto-commit and push this post? (y/N): ')).toLowerCase() === 'y'

  if (shouldCommit) {
    console.log('\n🔄 Running git commands...\n')

    // Check if git repo
    const gitCheck = exec('git rev-parse --git-dir')
    if (!gitCheck) {
      console.log('❌ Not a git repository!')
      rl.close()
      return
    }

    // Check for uncommitted changes
    const status = exec('git status --porcelain')
    if (!status || status.trim() === '') {
      console.log('ℹ️ No changes to commit.')
      rl.close()
      return
    }

    // Stage the new post
    console.log('📦 Staging changes...')
    exec('git add -A')

    // Commit
    const commitMsg = `add post: ${title}`
    console.log(`💾 Committing: "${commitMsg}"`)
    const commitResult = exec(`git commit -m "${commitMsg}"`)
    if (!commitResult) {
      console.log('❌ Commit failed')
      rl.close()
      return
    }

    // Push
    console.log('🚀 Pushing to remote...')
    const currentBranch = exec('git branch --show-current')?.trim() || 'main'
    const pushResult = exec(`git push origin ${currentBranch}`)
    if (!pushResult) {
      console.log('❌ Push failed')
      rl.close()
      return
    }

    console.log('\n✅ Post published successfully!')
    console.log(`🔗 It will be live at: /blog/${slug}`)
  } else {
    console.log('\n💡 Manual push reminder:')
    console.log('   git add -A')
    console.log(`   git commit -m "add post: ${title}"`)
    console.log('   git push origin main')
  }

  rl.close()
}

main().catch(console.error)
