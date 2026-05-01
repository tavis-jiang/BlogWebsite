#!/usr/bin/env node
// Interactive post deletion script
// Usage: node scripts/delete-post.js

import { createInterface } from 'readline'
import { readdirSync, statSync, rmSync, existsSync } from 'fs'
import { join } from 'path'
import { execSync } from 'child_process'

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
})

const question = (prompt) => new Promise(resolve => rl.question(prompt, resolve))

const BLOG_DIR = './src/content/blog'

function getPosts() {
  const items = readdirSync(BLOG_DIR)
  const posts = []

  items.forEach(item => {
    const fullPath = join(BLOG_DIR, item)
    const stat = statSync(fullPath)

    if (stat.isDirectory()) {
      // Folder-based post
      const indexPath = join(fullPath, 'index.md')
      if (existsSync(indexPath)) {
        posts.push({
          name: item,
          path: fullPath,
          type: 'folder',
          display: `📁 ${item}/`
        })
      }
    } else if (item.endsWith('.md') || item.endsWith('.mdx')) {
      // File-based post
      posts.push({
        name: item,
        path: fullPath,
        type: 'file',
        display: `📄 ${item}`
      })
    }
  })

  return posts
}

async function main() {
  console.log('🗑️  Delete Blog Post\n')

  const posts = getPosts()

  if (posts.length === 0) {
    console.log('ℹ️  No posts found!')
    rl.close()
    return
  }

  console.log('Available posts:')
  posts.forEach((post, i) => {
    console.log(`  ${i + 1}. ${post.display}`)
  })

  const answer = await question('\nEnter number to delete (or 0 to cancel): ')
  const index = parseInt(answer) - 1

  if (answer === '0' || isNaN(index) || index < 0 || index >= posts.length) {
    console.log('❌ Cancelled')
    rl.close()
    return
  }

  const post = posts[index]
  console.log(`\n⚠️  You are about to delete: ${post.display}`)
  const confirm = await question('Are you sure? (type "yes" to confirm): ')

  if (confirm !== 'yes') {
    console.log('❌ Cancelled')
    rl.close()
    return
  }

  // Delete
  try {
    rmSync(post.path, { recursive: true, force: true })
    console.log(`✅ Deleted: ${post.name}`)

    // Ask about committing
    const shouldCommit = (await question('\nCommit and push this change? (y/N): ')).toLowerCase() === 'y'

    if (shouldCommit) {
      console.log('\n🚀 Committing and pushing...')
      try {
        execSync('git add -A', { stdio: 'inherit' })
        execSync(`git commit -m "delete post: ${post.name}"`, { stdio: 'inherit' })
        execSync('git push origin main', { stdio: 'inherit' })
        console.log('✅ Done!')
      } catch (e) {
        console.log('❌ Git operation failed')
      }
    } else {
      console.log('\n💡 To commit manually:')
      console.log(`   git add -A`)
      console.log(`   git commit -m "delete post: ${post.name}"`)
      console.log(`   git push origin main`)
    }
  } catch (e) {
    console.log(`❌ Error deleting: ${e.message}`)
  }

  rl.close()
}

main().catch(console.error)
