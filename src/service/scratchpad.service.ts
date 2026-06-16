import data from '@/data/data.json'

export interface ScratchpadItem {
    html: string
    rawText: string
    date: string | null
    tags: string[]
    isImageOnly: boolean
    imageUrl: string | null
}

export interface ScratchpadContent {
    items: ScratchpadItem[]
    previewText: string
    title: string
}

export function getGoogleDocId(): string | null {
    const id = (data as any).scratchpad?.googleDocId
    if (!id || id === 'YOUR_GOOGLE_DOC_ID' || id.trim() === '') return null
    return id.trim()
}

// ─── Proxy resolvers ──────────────────────────────────────────────────────────
// NOTE: Cache-busting is on the *Google Doc source URL* only.
// Proxy URLs use default browser HTTP caching so the browser can reuse
// a recent proxy response across page loads (short TTL).
const PROXY_RESOLVERS = [
    {
        name: 'corsproxy.io',
        getUrl: (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
        parse: async (res: Response) => res.text(),
    },
    {
        name: 'allorigins.win',
        getUrl: (url: string) => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
        parse: async (res: Response) => {
            const json = await res.json()
            if (!json.contents) throw new Error('Empty AllOrigins response')
            return json.contents
        },
    },
    {
        name: 'codetabs.com',
        getUrl: (url: string) => `https://api.codetabs.com/v1/proxy?url=${encodeURIComponent(url)}`,
        parse: async (res: Response) => res.text(),
    },
]

async function fetchWithFallback(docUrl: string): Promise<string> {
    let lastError: Error | null = null
    for (const proxy of PROXY_RESOLVERS) {
        try {
            const res = await fetch(proxy.getUrl(docUrl))
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            const html = await proxy.parse(res)
            if (html?.trim()) return html
            throw new Error('Empty proxy response')
        } catch (err) {
            console.warn(`[Scratchpad] Proxy ${proxy.name} failed:`, err)
            lastError = err instanceof Error ? err : new Error(String(err))
        }
    }
    throw lastError || new Error('All CORS proxies failed.')
}

// ─── In-memory cache with TTL ─────────────────────────────────────────────────
const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes

let cachedContent: ScratchpadContent | null = null
let cacheTimestamp = 0
let pendingPromise: Promise<ScratchpadContent> | null = null

export async function fetchGoogleDoc(forceRefresh = false): Promise<ScratchpadContent> {
    const now = Date.now()
    const isFresh = cachedContent && (now - cacheTimestamp) < CACHE_TTL_MS

    if (!forceRefresh && isFresh) return cachedContent!
    if (!forceRefresh && pendingPromise) return pendingPromise

    const googleDocId = getGoogleDocId()
    if (!googleDocId) throw new Error('Google Doc ID is not configured.')

    // Cache-bust only the source URL (not the proxy wrapper)
    const docUrlBase = googleDocId.startsWith('2PACX-')
        ? `https://docs.google.com/document/d/e/${googleDocId}/pub`
        : `https://docs.google.com/document/d/${googleDocId}/export?format=html`

    const docUrl = forceRefresh
        ? `${docUrlBase}${docUrlBase.includes('?') ? '&' : '?'}_=${now}`
        : docUrlBase

    const fetchPromise = (async () => {
        try {
            const rawHtml = await fetchWithFallback(docUrl)
            const parsed = parseAndCleanHtml(rawHtml)
            cachedContent = parsed
            cacheTimestamp = Date.now()
            return parsed
        } finally {
            pendingPromise = null
        }
    })()

    pendingPromise = fetchPromise
    return fetchPromise
}

// ─── Parser ───────────────────────────────────────────────────────────────────
function parseAndCleanHtml(rawHtml: string): ScratchpadContent {
    if (typeof window === 'undefined') return { items: [], previewText: '', title: '' }

    const parser = new DOMParser()
    const doc = parser.parseFromString(rawHtml, 'text/html')

    // Title
    const titleEl = doc.querySelector('title') || doc.querySelector('h1')
    const title = titleEl?.textContent?.trim() || 'My Scratchpad'

    // Fix links
    doc.querySelectorAll('a').forEach((a) => {
        const href = a.getAttribute('href')
        if (href?.startsWith('https://www.google.com/url?q=')) {
            try {
                const realUrl = new URL(href).searchParams.get('q')
                if (realUrl) a.setAttribute('href', realUrl)
            } catch { /* keep original */ }
        }
        a.setAttribute('target', '_blank')
        a.setAttribute('rel', 'noopener noreferrer')
    })

    // Identify monospace classes in a single stylesheet pass
    const monospaceClasses = new Set<string>()
    doc.querySelectorAll('style').forEach((styleTag) => {
        const cssText = styleTag.textContent || ''
        for (const match of cssText.matchAll(/\.([a-zA-Z0-9_-]+)\s*\{([^}]+)\}/g)) {
            const props = match[2]
            if (
                props.includes('font-family') &&
                (props.includes('Courier') || props.includes('Consolas') ||
                 props.includes('monospace') || props.includes('Source Code Pro'))
            ) {
                monospaceClasses.add(match[1])
            }
        }
    })

    // Apply monospace attribute via a single querySelector per class (batched)
    if (monospaceClasses.size > 0) {
        const selector = [...monospaceClasses].map(c => `.${c}`).join(',')
        doc.querySelectorAll(selector).forEach(el => el.setAttribute('data-monospace', 'true'))
    }

    // Remove style blocks
    doc.querySelectorAll('style').forEach(s => s.remove())

    // Convert dash-only paragraphs to <hr> — use a single querySelectorAll pass
    doc.body.querySelectorAll('p, div, h1, h2, h3, h4, h5, h6').forEach((el) => {
        const text = el.textContent?.trim() || ''
        if (text.length > 0 && /^[—–―─-]{1,15}$/.test(text)) {
            el.replaceWith(doc.createElement('hr'))
        }
    })

    // Strip inline styles and class attributes in one pass
    doc.body.querySelectorAll('[style],[class]').forEach((el) => {
        el.removeAttribute('style')
        el.removeAttribute('class')
    })

    // All images lazy by default — the first visible one gets upgraded after chunking
    doc.body.querySelectorAll('img').forEach((img) => {
        img.setAttribute('loading', 'lazy')
        img.setAttribute('decoding', 'async')
    })

    // Split by <hr> into chunks
    const items: ScratchpadItem[] = []
    let currentChunk = doc.createElement('div')

    Array.from(doc.body.childNodes).forEach((node) => {
        if (node.nodeName.toLowerCase() === 'hr') {
            if (currentChunk.innerHTML.trim()) {
                items.push(processChunk(currentChunk))
                currentChunk = doc.createElement('div')
            }
        } else {
            currentChunk.appendChild(node.cloneNode(true))
        }
    })
    if (currentChunk.innerHTML.trim()) items.push(processChunk(currentChunk))

    // LCP: promote first image of the most-recent log to eager + high priority
    if (items.length > 0) {
        const tmp = doc.createElement('div')
        tmp.innerHTML = items[0].html
        const firstImg = tmp.querySelector('img')
        if (firstImg) {
            firstImg.setAttribute('loading', 'eager')
            firstImg.setAttribute('fetchpriority', 'high')
            firstImg.removeAttribute('decoding')
            items[0] = { ...items[0], html: tmp.innerHTML.trim() }
        }
    }

    const previewText = items[0]
        ? (() => {
            const tmp = doc.createElement('div')
            tmp.innerHTML = items[0].html
            return (tmp.textContent || '').replace(/\s+/g, ' ').substring(0, 180).trim() + '...'
        })()
        : ''

    return { items, previewText, title }
}

// ─── Date patterns (compiled once, not per chunk) ────────────────────────────
const DATE_PATTERNS = [
    /(?:\[|\()?((?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{1,2},?\s+\d{4})(?:\]|\))?/i,
    /(?:\[|\()?(\\d{1,2}\s+(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{4})(?:\]|\))?/i,
    /(?:\[|\()?(\d{4}[-/]\d{2}[-/]\d{2})(?:\]|\))?/,
    /(?:\[|\()?(\d{1,2}[-/]\d{1,2}[-/]\d{4})(?:\]|\))?/,
]
const BRACKET_TAG_RE = /\[([a-zA-Z0-9_\-+#.\s]{2,20})\]/g
const HASH_TAG_RE = /(?:^|\s)#([a-zA-Z0-9_\-+]{2,20})\b/g
const VOID_TAGS = new Set(['img', 'hr', 'br', 'iframe', 'input'])

function collectTextNodes(node: Node, out: Node[] = []): Node[] {
    if (node.nodeType === Node.TEXT_NODE) out.push(node)
    else node.childNodes.forEach(c => collectTextNodes(c, out))
    return out
}

function processChunk(chunkDiv: HTMLDivElement): ScratchpadItem {
    const textContent = chunkDiv.textContent?.trim() || ''

    // Image detection
    const imgEl = chunkDiv.querySelector('img')
    const isImageOnly = !!(imgEl && !textContent)
    const imageUrl = imgEl?.getAttribute('src') ?? null

    // Date + tags from text nodes (single traversal)
    const textNodes = collectTextNodes(chunkDiv)
    let date: string | null = null
    const tags: string[] = []
    const seenTags = new Set<string>()

    for (const node of textNodes) {
        const text = node.textContent || ''
        if (!text.trim()) continue

        // Date — stop after first match
        if (!date) {
            for (const pattern of DATE_PATTERNS) {
                const m = text.match(pattern)
                if (m) { date = m[1].trim(); break }
            }
        }

        // Bracket tags
        BRACKET_TAG_RE.lastIndex = 0
        let m: RegExpExecArray | null
        while ((m = BRACKET_TAG_RE.exec(text)) !== null) {
            const tag = m[1].trim()
            const formatted = tag.charAt(0).toUpperCase() + tag.slice(1)
            if (tag && !seenTags.has(formatted)) { seenTags.add(formatted); tags.push(formatted) }
        }

        // Hash tags
        HASH_TAG_RE.lastIndex = 0
        while ((m = HASH_TAG_RE.exec(text)) !== null) {
            const tag = m[1].trim()
            if (tag && !/^\d+$/.test(tag)) {
                const formatted = tag.charAt(0).toUpperCase() + tag.slice(1)
                if (!seenTags.has(formatted)) { seenTags.add(formatted); tags.push(formatted) }
            }
        }
    }

    // Remove empty elements (single pass — iterate in reverse so removal doesn't affect traversal)
    const all = Array.from(chunkDiv.querySelectorAll('*')).reverse()
    for (const el of all) {
        const tag = el.tagName.toLowerCase()
        if (VOID_TAGS.has(tag)) continue
        if (
            el.childNodes.length === 0 ||
            (el.textContent?.trim() === '' && el.querySelectorAll('img,hr,br,iframe').length === 0)
        ) {
            el.remove()
        }
    }

    return {
        html: chunkDiv.innerHTML.trim(),
        rawText: textContent,
        date,
        tags,
        isImageOnly,
        imageUrl,
    }
}
