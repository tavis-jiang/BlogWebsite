#!/usr/bin/env node
// Sync posts from Obsidian vault to blog
// Usage:
//   npm run sync-obsidian                    (uses default path)
//   npm run sync-obsidian -- /path/to/vault  (specify vault path)
//   npm run sync-obsidian --push             (sync + git push)

import { createInterface } from 'readline'
import { readdirSync, readFileSync, writeFileSync, copyFileSync, mkdirSync, existsSync, statSync } from 'fs'
import { join, basename, extname } from 'path'
import { execSync } from 'child_process'

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
})

const question = (prompt) => new Promise(resolve => rl.question(prompt, resolve))

// Allow custom vault path via command line argument
const customVaultPath = process.argv.find((arg, i) => i > 1 && !arg.startsWith('--'))

// Determine vault path - ONLY sync from /obsidian/post/ (not entire vault)
const getVaultPath = () => {
  if (customVaultPath) return customVaultPath
  if (process.env.OBSIDIAN_VAULT) return process.env.OBSIDIAN_VAULT
  // ONLY use ./obsidian/post - never sync entire vault
  return './obsidian/post'
}

const OBSIDIAN_DIR = getVaultPath()
const BLOG_DIR = './src/content/blog'

// Parse frontmatter from Obsidian format
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return { data: {}, content }

  const frontmatter = match[1]
  const body = content.slice(match[0].length).trim()
  const data = {}

  frontmatter.split('\n').forEach(line => {
    const [key, ...rest] = line.split(':')
    if (key && rest.length) {
      let value = rest.join(':').trim()
      value = value.replace(/^['"](.*)['"]$/, '$1')
      data[key.trim()] = value
    }
  })

  return { data, content: body }
}

// Convert Obsidian links to blog format
function convertLinks(content) {
  content = content.replace(/\[\[([^\]|]+)\|?([^\]]*)\]\]/g, (match, note, display) => {
    const slug = note.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const text = display || note
    return `[${text}](/blog/${slug})`
  })

  content = content.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
    if (src.startsWith('http')) return match
    if (src.startsWith('./') || src.startsWith('../')) return match
    return `![${alt}](./${src})`
  })

  return content
}

function syncPost(obsidianPath) {
  const filename = basename(obsidianPath, extname(obsidianPath))
  const slug = filename.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  const content = readFileSync(obsidianPath, 'utf-8')
  const { data, content: body } = parseFrontmatter(content)

  if (data.draft === 'true') {
    console.log(`  ⏭️  Skipping draft: ${filename}`)
    return null
  }

  const blogData = {
    title: data.title || filename,
    description: data.description || '',
    publishDate: data['publish-date'] || data.publishDate || new Date().toISOString(),
    ...(data.tags && { tags: data.tags.split(',').map(t => t.trim()) }),
    ...(data['hero-image'] && { heroImage: { src: data['hero-image'], color: data['hero-color'] || '#659EB9' } })
  }

  const obsidianFolder = obsidianPath.replace('.md', '').replace('.mdx', '')
  const hasAssets = existsSync(obsidianFolder) && statSync(obsidianFolder).isDirectory()

  let blogPath
  let finalBody = convertLinks(body)

  if (hasAssets) {
    const postDir = join(BLOG_DIR, slug)
    mkdirSync(postDir, { recursive: true })

    const assets = readdirSync(obsidianFolder)
    assets.forEach(asset => {
      const src = join(obsidianFolder, asset)
      const dest = join(postDir, asset)
      try {
        copyFileSync(src, dest)
        console.log(`  📎 Copied asset: ${asset}`)
      } catch (e) {
        console.log(`  ⚠️  Skipped: ${asset}`)
      }
    })

    blogPath = join(postDir, 'index.md')
  } else {
    blogPath = join(BLOG_DIR, `${slug}.md`)
  }

  const frontmatterLines = ['---']
  Object.entries(blogData).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      frontmatterLines.push(`${key}:`)
      value.forEach(v => frontmatterLines.push(`  - ${v}`))
    } else if (typeof value === 'object' && value !== null) {
      frontmatterLines.push(`${key}:`)
      Object.entries(value).forEach(([k, v]) => {
        frontmatterLines.push(`  ${k}: ${v}`)
      })
    } else {
      frontmatterLines.push(`${key}: '${value}'`)
    }
  })
  frontmatterLines.push('---')

  const finalContent = `${frontmatterLines.join('\n')}\n\n${finalBody}`
  writeFileSync(blogPath, finalContent)

  return { slug, title: blogData.title, path: blogPath }
}

async function main() {
  console.log('🔄 Syncing Obsidian posts...\n')
  console.log(`📁 Source: ${OBSIDIAN_DIR}\n`)

  if (!existsSync(OBSIDIAN_DIR)) {
    console.log('❌ Obsidian directory not found!')
    console.log(`\nOptions:`)
    console.log(`  1. Set path as argument: npm run sync-obsidian -- /path/to/vault/posts`)
    console.log(`  2. Set env variable: OBSIDIAN_VAULT=/path npm run sync-obsidian`)
    console.log(`  3. Create symlink: ln -s /path/to/vault/posts ./obsidian/posts`)

    const setupSymlink = await question('\nCreate symlink to your vault? (y/N): ')
    if (setupSymlink.toLowerCase() === 'y') {
      const vaultPath = await question('Enter full path to your vault posts folder: ')
      if (existsSync(vaultPath)) {
        mkdirSync('./obsidian', { recursive: true })
        try {
          execSync(`ln -s "${vaultPath}" ./obsidian/posts`)
          console.log('✅ Symlink created! Run the command again.')
        } catch (e) {
          console.log('❌ Failed to create symlink:', e.message)
        }
      } else {
        console.log('❌ Path does not exist')
      }
    }
    rl.close()
    process.exit(1)
  }

  const files = readdirSync(OBSIDIAN_DIR)
    .filter(f => f.endsWith('.md') || f.endsWith('.mdx'))
    .sort()

  if (files.length === 0) {
    console.log('ℹ️  No .md/.mdx files found in Obsidian vault')
    rl.close()
    process.exit(0)
  }

  console.log(`Found ${files.length} post(s):`)
  files.forEach(f => console.log(`  • ${f}`))
  console.log('')

  const synced = []

  files.forEach(file => {
    console.log(`📄 Processing: ${file}`)
    const result = syncPost(join(OBSIDIAN_DIR, file))
    if (result) {
      synced.push(result)
      console.log(`  ✅ Synced: ${result.title}`)
    }
  })

  console.log(`\n📊 Synced ${synced.length} post(s)`)

  if (synced.length > 0) {
    const shouldPush = process.argv.includes('--push') ||
                       (await question('\nCommit and push now? (y/N): ')).toLowerCase() === 'y'

    if (shouldPush) {
      console.log('\n🚀 Committing and pushing...')
      try {
        execSync('git add -A', { stdio: 'inherit' })
        execSync('git commit -m "sync posts from obsidian"', { stdio: 'inherit' })
        execSync('git push origin main', { stdio: 'inherit' })
        console.log('\n✅ Done!')
      } catch (e) {
        console.log('\n❌ Git operation failed')
      }
    }
  }

  rl.close()
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
