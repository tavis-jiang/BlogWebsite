/**
 * Simple i18n utility for Chinese/English language switching.
 * Uses localStorage to persist language preference and data-i18n attributes
 * for marking translatable elements.
 */

export type Lang = 'en' | 'zh'

const LANG_KEY = 'site-lang'

/** Translation dictionaries */
const translations: Record<Lang, Record<string, string>> = {
  en: {
    // Header / Navigation
    'nav.blog': 'Blog',
    'nav.projects': 'Projects',
    'nav.links': 'Links',
    'nav.about': 'About',
    'nav.search': 'Search',
    'nav.menu': 'Menu',

    // Theme
    'theme.dark': 'Dark Theme',
    'theme.set': 'Set theme to',

    // Home page
    'home.greeting': 'Hi there! 👋',
    'home.description': 'Stay hungry, stay foolish',

    // Blog
    'blog.title': 'Blog',
    'blog.read_more': 'Read more',
    'blog.no_posts': 'No posts yet',

    // Projects
    'projects.title': 'Projects',

    // Links
    'links.title': 'Links',

    // About
    'about.title': 'About',

    // Archives
    'archives.title': 'Archives',

    // Search
    'search.title': 'Search',
    'search.placeholder': 'Search posts...',

    // Tags
    'tags.title': 'Tags',

    // Terms
    'terms.title': 'Terms',

    // 404
    '404.title': '404',
    '404.message': 'Page not found',
    '404.back': 'Back to home',

    // Footer
    'footer.credits': 'Powered by Astro & Pure theme',
    'footer.site_policy': 'Site Policy',

    // Language switcher
    'lang.switch': 'Switch language',
    'lang.label': '中'
  },
  zh: {
    // Header / Navigation
    'nav.blog': '博客',
    'nav.projects': '项目',
    'nav.links': '友链',
    'nav.about': '关于',
    'nav.search': '搜索',
    'nav.menu': '菜单',

    // Theme
    'theme.dark': '深色模式',
    'theme.set': '切换主题为',

    // Home page
    'home.greeting': '你好！👋',
    'home.description': '求知若饥，虚心若愚',

    // Blog
    'blog.title': '博客',
    'blog.read_more': '阅读更多',
    'blog.no_posts': '暂无文章',

    // Projects
    'projects.title': '项目',

    // Links
    'links.title': '友链',

    // About
    'about.title': '关于',

    // Archives
    'archives.title': '归档',

    // Search
    'search.title': '搜索',
    'search.placeholder': '搜索文章...',

    // Tags
    'tags.title': '标签',

    // Terms
    'terms.title': '条款',

    // 404
    '404.title': '404',
    '404.message': '页面未找到',
    '404.back': '返回首页',

    // Footer
    'footer.credits': '由 Astro & Pure 主题驱动',
    'footer.site_policy': '站点政策',

    // Language switcher
    'lang.switch': '切换语言',
    'lang.label': 'EN'
  }
}

/** Get the current language from localStorage, defaults to 'en' */
export function getLang(): Lang {
  if (typeof localStorage === 'undefined') return 'en'
  const stored = localStorage.getItem(LANG_KEY)
  if (stored === 'zh' || stored === 'en') return stored
  return 'en'
}

/** Set the language and save to localStorage */
export function setLang(lang: Lang): void {
  localStorage.setItem(LANG_KEY, lang)
}

/** Toggle between 'en' and 'zh' */
export function toggleLang(): Lang {
  const current = getLang()
  const next: Lang = current === 'en' ? 'zh' : 'en'
  setLang(next)
  return next
}

/** Get a translation by key and optional language (defaults to current) */
export function t(key: string, lang?: Lang): string {
  const l = lang || (typeof window !== 'undefined' ? getLang() : 'en')
  return translations[l]?.[key] || translations['en']?.[key] || key
}

/** Get all translation keys */
export function getTranslationKeys(): string[] {
  return Object.keys(translations.en)
}

/**
 * Update all elements with [data-i18n] attribute to match current language.
 * Call this after language change.
 */
export function updateI18nElements(): void {
  const lang = getLang()
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en-US'

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n')
    if (key) {
      const text = t(key, lang)
      // Only update text content for inline elements, skip elements with children
      if (!el.children.length || el.querySelectorAll('[data-i18n]').length) {
        el.textContent = text
      }
    }
  })

  // Also update placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder')
    if (key && el instanceof HTMLInputElement) {
      el.placeholder = t(key, lang)
    }
  })

  // Update aria-labels
  document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    const key = el.getAttribute('data-i18n-aria')
    if (key) {
      el.setAttribute('aria-label', t(key, lang))
    }
  })
}

/**
 * Initialize i18n on page load.
 * Sets the html lang attribute and updates all i18n elements.
 */
export function initI18n(): void {
  const lang = getLang()
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en-US'
  updateI18nElements()
}
