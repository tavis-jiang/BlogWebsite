---
title: 'README'
description: 'so this is some basic introduction of the website'
publishDate: '2026-05-01T14:38:08Z'
---

> *Time to start, time to move*

## Introduction
So the reason why I use this website is because JerryMain, one of my best friend, who told us to make a self-web to upload some thoughts and he found this template by accident, and after viewing, I found this template is quite good for a website, and I decided to use it also.
## The workflow 
So the origin template is [Astro Theme Pure](https://github.com/cworld1/astro-theme-pure) ,and if you are interested in [mine](https://github.com/tavis-jiang/BlogWebsite) or [JerryMain's](https://github.com/JerryMain521/website) , just click it and then try to make a website yourself.

Read some of his files, you will get a lot!
### How to read the whole file structure
When I was trying to make my own website, it was quite tough to know how to change every part of the site.

To save your time, I am going to introduce the structure of the whole project to help you understand the steps to customize it.


### Configuration: src/site.config.ts

This is the brain of the website. You will change some important part of the website 
-  Site Title:change the title of the web, sth like "Tavis's Island".
- **Author Info**:Update your name, social media links, and avatar.

## Main Page: src/pages/index.astro

This controls your homepage. You can customize:
- Profile picture
- Location label  
- Source code link
- About section
- Education cards
- Skills

### Changing Location and Source Code

Find the `Label` components in `index.astro` and change:
- `title='Shanghai, China'` for location
- `href='https://github.com/tavis-jiang/BlogWebsite'` for source code

## Blog Posts: src/content/blog/

This is where your blog posts live. You can:
1. Write in Obsidian in the `post/` folder
2. Sync using `npm run sync-obsidian`
3. Push to GitHub with `git push`

## My Customizations

Here's what I changed:
1. ✅ Changed location to "Shanghai, China"
2. ✅ Updated source code link to my GitHub
3. ✅ Changed SJTU logo to red (#B01020)
4. ✅ Created Obsidian workflow for writing posts
5. ✅ Set up auto-sync script

## Conclusion

Building this website was a fun journey. Thanks to JerryMain for the inspiration and to the Astro Theme Pure creator for the excellent template.

Happy blogging! 🚀