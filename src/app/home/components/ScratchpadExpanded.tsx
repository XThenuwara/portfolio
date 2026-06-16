'use client'

import React, { useEffect, useState, useCallback, useMemo, memo, useRef } from 'react'
import { fetchGoogleDoc, getGoogleDocId, ScratchpadItem } from '@/service/scratchpad.service'
import { Icon } from '@iconify/react/dist/iconify.js'
import LoadingSpinner from '@/components/LoadingSpinner'
import { TransformWrapper, TransformComponent, useControls } from 'react-zoom-pan-pinch'

// ─── Zoom Controls ─────────────────────────────────────────────────────────────
const ZoomControls = memo(({ onBack }: { onBack: () => void }) => {
    const { zoomIn, zoomOut, resetTransform } = useControls()
    return (
        <div
            role="toolbar"
            aria-label="Image zoom controls"
            className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm rounded-xl px-3 py-1.5 border border-white/10"
        >
            <button
                onClick={onBack}
                aria-label="Close image zoom"
                className="flex items-center gap-1.5 text-white/70 hover:text-white text-[11px] font-medium transition-colors pr-2 border-r border-white/15 focus-visible:outline focus-visible:outline-white/40 rounded"
            >
                <Icon icon="lucide:arrow-left" width="12" aria-hidden="true" />
                <span>Back</span>
            </button>
            <button onClick={() => zoomOut()} aria-label="Zoom out" className="text-white/60 hover:text-white transition-colors p-0.5 focus-visible:outline focus-visible:outline-white/40 rounded">
                <Icon icon="lucide:minus" width="13" aria-hidden="true" />
            </button>
            <button onClick={() => resetTransform()} aria-label="Fit to screen" className="text-white/60 hover:text-white transition-colors p-0.5 focus-visible:outline focus-visible:outline-white/40 rounded">
                <Icon icon="lucide:maximize-2" width="13" aria-hidden="true" />
            </button>
            <button onClick={() => zoomIn()} aria-label="Zoom in" className="text-white/60 hover:text-white transition-colors p-0.5 focus-visible:outline focus-visible:outline-white/40 rounded">
                <Icon icon="lucide:plus" width="13" aria-hidden="true" />
            </button>
        </div>
    )
})
ZoomControls.displayName = 'ZoomControls'

// ─── Masonry Card ─────────────────────────────────────────────────────────────
// Uses <button> so it's keyboard-focusable and announced as interactive
const MasonryCard = memo(({
    item,
    logNumber,
    isActive,
    onClick,
}: {
    item: ScratchpadItem
    logNumber: number
    isActive: boolean
    onClick: (item: ScratchpadItem) => void
}) => {
    const handleClick = useCallback(() => onClick(item), [onClick, item])

    // Build a readable label for screen readers
    const label = [
        `Log ${logNumber}`,
        item.date ? `dated ${item.date}` : '',
        item.tags?.length ? `tagged ${item.tags.join(', ')}` : '',
        item.rawText ? item.rawText.replace(/\s+/g, ' ').trim().slice(0, 80) : '',
    ].filter(Boolean).join('. ')

    return (
        <button
            onClick={handleClick}
            aria-pressed={isActive}
            aria-label={label}
            className={`
                scratchpad-masonry-card text-left
                group break-inside-avoid mb-3 w-full rounded-xl border cursor-pointer
                transition-all duration-200 overflow-hidden
                focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                focus-visible:outline-neutral-500 dark:focus-visible:outline-neutral-300
                ${isActive
                    ? 'border-neutral-400/50 dark:border-neutral-400/30 bg-white dark:bg-neutral-800/60 shadow-md ring-1 ring-neutral-200 dark:ring-white/10'
                    : 'border-neutral-200/60 dark:border-white/8 bg-white dark:bg-neutral-900/40 hover:border-neutral-300 dark:hover:border-white/15 hover:shadow-md'
                }
            `}
        >
            {/* Meta */}
            {(item.date || item.tags?.length > 0) && (
                <div className="flex items-center justify-between gap-2 px-3.5 pt-3 pb-0">
                    {item.date && (
                        <span className="text-[9px] font-semibold text-neutral-400 dark:text-neutral-500 flex items-center gap-1">
                            <Icon icon="lucide:calendar" width="9" aria-hidden="true" />
                            <time dateTime={item.date}>{item.date}</time>
                        </span>
                    )}
                    {item.tags?.length > 0 && (
                        <div className="flex gap-1 flex-wrap justify-end" aria-hidden="true">
                            {item.tags.map(tag => (
                                <span key={tag} className={`text-[8px] font-semibold px-1.5 py-0.5 rounded-full ${isActive ? 'bg-neutral-900/8 dark:bg-white/8 text-neutral-600 dark:text-neutral-300' : 'bg-neutral-100 dark:bg-white/5 text-neutral-500 dark:text-neutral-400'}`}>
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Content — aria-hidden since the button label already summarises it */}
            <div className="px-3.5 py-2.5" aria-hidden="true">
                <div
                    className="scratchpad-card-content scratchpad-content text-[11px] leading-relaxed text-neutral-700 dark:text-neutral-300"
                    dangerouslySetInnerHTML={{ __html: item.html }}
                />
            </div>

            {/* Footer */}
            <div className="px-3.5 pb-2.5 flex items-center justify-between" aria-hidden="true">
                <span className="text-[8.5px] font-bold tracking-widest uppercase text-neutral-300 dark:text-neutral-600">#{logNumber}</span>
                {isActive
                    ? <span className="text-[9px] font-semibold text-neutral-400 dark:text-neutral-500 flex items-center gap-1"><Icon icon="lucide:panel-right-open" width="9" aria-hidden="true" />Previewing</span>
                    : <span className="text-[9px] text-neutral-300 dark:text-neutral-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity"><Icon icon="lucide:arrow-right" width="9" aria-hidden="true" />Preview</span>
                }
            </div>
        </button>
    )
})
MasonryCard.displayName = 'MasonryCard'

// ─── Right Preview Panel ───────────────────────────────────────────────────────
const PreviewPanel = memo(({ log, logNumber, onBack }: { log: ScratchpadItem; logNumber: number; onBack?: () => void }) => {
    const [imgSrc, setImgSrc] = useState<string | null>(null)
    const headingRef = useRef<HTMLHeadingElement>(null)

    useEffect(() => {
        setImgSrc(null)
        // Move focus to heading when log changes so screen readers announce it
        headingRef.current?.focus()
    }, [log])

    const handleClick = useCallback((e: React.MouseEvent) => {
        const t = e.target as HTMLElement
        if (t.tagName.toLowerCase() === 'img') {
            const src = t.getAttribute('src')
            if (src) { e.stopPropagation(); setImgSrc(src) }
        }
    }, [])

    return (
        <div className="flex flex-col h-full min-h-0">
            {/* Header */}
            <div className="px-4 md:px-5 pt-4 pb-3 border-b border-neutral-100 dark:border-white/6 shrink-0">
                <div className="flex items-center gap-2 flex-wrap">
                    {onBack && (
                        <button
                            onClick={onBack}
                            aria-label="Back to log list"
                            className="md:hidden mr-2 p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/8 text-neutral-500 dark:text-neutral-400 transition-colors focus-visible:outline focus-visible:outline-2"
                        >
                            <Icon icon="lucide:arrow-left" width="16" aria-hidden="true" />
                        </button>
                    )}
                    {/* Focusable heading — receives focus on log change for screen readers */}
                    <h2
                        ref={headingRef}
                        tabIndex={-1}
                        className="text-[9px] font-bold tracking-widest uppercase text-neutral-400 dark:text-neutral-500 focus:outline-none"
                    >
                        #{logNumber}
                    </h2>
                    {log.date && (
                        <>
                            <span aria-hidden="true" className="text-neutral-200 dark:text-neutral-700 text-xs">·</span>
                            <time
                                dateTime={log.date}
                                className="text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center gap-1"
                            >
                                <Icon icon="lucide:calendar" width="10" aria-hidden="true" />{log.date}
                            </time>
                        </>
                    )}
                </div>
                {log.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2" aria-label="Tags">
                        {log.tags.map(tag => (
                            <span key={tag} className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-white/6 text-neutral-500 dark:text-neutral-400 border border-neutral-200/50 dark:border-white/8">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Body */}
            <div className="flex-1 min-h-0 relative">
                {imgSrc ? (
                    <div
                        className="absolute inset-0 bg-neutral-950 flex flex-col"
                        role="region"
                        aria-label="Image zoom viewer"
                    >
                        <TransformWrapper
                            initialScale={1}
                            minScale={0.1}
                            maxScale={12}
                            centerOnInit
                            onInit={(ref) => setTimeout(() => ref.zoomToElement('zoom-img', undefined, 0), 50)}
                            doubleClick={{ mode: 'zoomIn' }}
                            wheel={{ step: 0.1 }}
                            pinch={{ step: 5 }}
                        >
                            <ZoomControls onBack={() => setImgSrc(null)} />
                            <TransformComponent
                                wrapperStyle={{ width: '100%', flex: '1 1 0%', minHeight: 0 }}
                                contentStyle={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '64px 24px 40px' }}
                            >
                                <img
                                    id="zoom-img"
                                    src={imgSrc}
                                    alt="Enlarged log image"
                                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: 8, userSelect: 'none', pointerEvents: 'none' }}
                                    draggable={false}
                                />
                            </TransformComponent>
                            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-white/25 select-none pointer-events-none whitespace-nowrap" aria-hidden="true">
                                Scroll · pinch · double-click to zoom
                            </p>
                        </TransformWrapper>
                    </div>
                ) : (
                    // aria-live so screen readers announce when the content changes
                    <div
                        className="absolute inset-0 overflow-y-auto px-4 md:px-5 py-4"
                        onClick={handleClick}
                        aria-live="polite"
                        aria-atomic="false"
                    >
                        <div
                            className="scratchpad-content text-[13.5px] leading-relaxed text-neutral-800 dark:text-neutral-200"
                            dangerouslySetInnerHTML={{ __html: log.html }}
                        />
                    </div>
                )}
            </div>
        </div>
    )
})
PreviewPanel.displayName = 'PreviewPanel'

// ─── Main ──────────────────────────────────────────────────────────────────────
const ScratchpadExpanded = () => {
    const [content, setContent] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [refreshing, setRefreshing] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedTag, setSelectedTag] = useState('All')
    const [selectedLog, setSelectedLog] = useState<ScratchpadItem | null>(null)
    const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState(false)

    const docId = getGoogleDocId()
    const searchId = 'scratchpad-search'

    const loadData = useCallback(async (isManualRefresh = false) => {
        if (!docId) return
        if (isManualRefresh) setRefreshing(true)
        else setLoading(true)
        try {
            const data = await fetchGoogleDoc(isManualRefresh)
            setContent(data)
            setError(null)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load.')
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }, [docId])

    useEffect(() => { loadData() }, [loadData])

    useEffect(() => {
        if (content?.items?.length && selectedLog === null) {
            setSelectedLog(content.items[0])
        }
    }, [content, selectedLog])

    const handleCardClick = useCallback((item: ScratchpadItem) => {
        setSelectedLog(item)
        setIsMobilePreviewOpen(true)
    }, [])

    const allTags = useMemo(() => {
        if (!content?.items) return ['All']
        const s = new Set<string>()
        content.items.forEach((item: ScratchpadItem) => item.tags?.forEach((t: string) => s.add(t)))
        return ['All', ...Array.from(s).sort()]
    }, [content?.items])

    const filteredItems = useMemo(() => {
        if (!content?.items) return []
        const q = searchQuery.toLowerCase().trim()
        return content.items.filter((item: ScratchpadItem) => {
            if (selectedTag !== 'All' && !item.tags.includes(selectedTag)) return false
            if (!q) return true
            return item.rawText.toLowerCase().includes(q) || item.tags.some((t: string) => t.toLowerCase().includes(q)) || (item.date?.toLowerCase().includes(q) ?? false)
        })
    }, [content?.items, selectedTag, searchQuery])

    const logNumbers = useMemo(() => {
        if (!content?.items) return new Map<ScratchpadItem, number>()
        const map = new Map<ScratchpadItem, number>()
        content.items.forEach((item: ScratchpadItem, i: number) => map.set(item, content.items.length - i))
        return map
    }, [content?.items])

    const logNumber = selectedLog ? (logNumbers.get(selectedLog) ?? 0) : 0
    const isPublishedUrl = docId?.startsWith('2PACX-') ?? false
    const editUrl = isPublishedUrl || !docId ? null : `https://docs.google.com/document/d/${docId}/edit`

    if (!docId) return (
        <div className="h-full flex flex-col items-center justify-center text-center p-8" role="status">
            <Icon icon="tabler:notebook-off" width="32" className="text-neutral-400 mb-3" aria-hidden="true" />
            <h3 className="text-base font-bold dark:text-neutral-100">No Google Doc Connected</h3>
        </div>
    )

    if (loading) return (
        <div className="h-full flex flex-col items-center justify-center" role="status" aria-label="Loading scratchpad">
            <LoadingSpinner />
            <span className="text-sm text-neutral-400 mt-3">Loading scratchpad…</span>
        </div>
    )

    return (
        <div className="flex h-full min-h-0 overflow-hidden w-full">

            {/* ══ LEFT: Masonry grid ════════════════════════════════════════════ */}
            <section
                aria-label="Scratchpad log list"
                className={`flex flex-col min-h-0 border-neutral-100 dark:border-white/6
                    ${isMobilePreviewOpen ? 'hidden md:flex md:w-[52%] md:shrink-0 md:border-r' : 'flex w-full md:w-[52%] md:shrink-0 md:border-r'}`}
            >
                {/* Toolbar */}
                <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-neutral-100 dark:border-white/6 shrink-0">
                    <div>
                        <h1 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                            {content?.title || 'Scratchpad'}
                        </h1>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="relative">
                            <label htmlFor={searchId} className="sr-only">Search logs</label>
                            <Icon icon="lucide:search" width="11" className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" aria-hidden="true" />
                            <input
                                id={searchId}
                                type="search"
                                placeholder="Search…"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                aria-controls="scratchpad-log-list"
                                className="text-[11px] pl-7 pr-6 py-1.5 rounded-lg bg-neutral-100 dark:bg-white/6 border border-neutral-200/60 dark:border-white/8 text-neutral-800 dark:text-neutral-200 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-300 dark:focus:ring-white/15 w-32"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    aria-label="Clear search"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 focus-visible:outline focus-visible:outline-1 rounded"
                                >
                                    <Icon icon="lucide:x" width="10" aria-hidden="true" />
                                </button>
                            )}
                        </div>
                        {editUrl && (
                            <a href={editUrl} target="_blank" rel="noopener noreferrer" aria-label="Open source Google Doc in new tab">
                                <button className="w-7 h-7 flex items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/8 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-neutral-400">
                                    <Icon icon="lucide:external-link" width="12" aria-hidden="true" />
                                </button>
                            </a>
                        )}
                        <button
                            onClick={() => loadData(true)}
                            disabled={refreshing}
                            aria-label={refreshing ? 'Syncing…' : 'Sync latest logs'}
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/8 transition-colors disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-neutral-400"
                        >
                            <Icon icon={refreshing ? 'svg-spinners:180-ring' : 'lucide:refresh-cw'} width="12" aria-hidden="true" />
                        </button>
                    </div>
                </div>

                {/* Tag filters */}
                {allTags.length > 1 && (
                    <div
                        role="group"
                        aria-label="Filter by tag"
                        className="flex gap-1.5 px-4 py-2 overflow-x-auto scrollbar-none shrink-0 border-b border-neutral-100 dark:border-white/6"
                    >
                        {allTags.map(tag => (
                            <button
                                key={tag}
                                onClick={() => setSelectedTag(tag)}
                                aria-pressed={selectedTag === tag}
                                className={`whitespace-nowrap text-[9px] font-semibold px-2.5 py-1 rounded-full border transition-all shrink-0
                                    focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-neutral-500
                                    ${selectedTag === tag
                                        ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 border-transparent'
                                        : 'text-neutral-500 dark:text-neutral-400 border-neutral-200 dark:border-white/10'
                                    }`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                )}

                {/* Log list */}
                <div
                    id="scratchpad-log-list"
                    className="flex-1 overflow-y-auto min-h-0 px-4 py-4"
                    role="feed"
                    aria-label={`${filteredItems.length} log${filteredItems.length !== 1 ? 's' : ''}`}
                    aria-busy={loading}
                >
                    {error ? (
                        <div role="alert" className="p-4 bg-rose-50 dark:bg-rose-950/20 rounded-xl border border-rose-200/50 text-rose-600 dark:text-rose-400">
                            <p className="text-xs font-semibold mb-1">Sync failed</p>
                            <p className="text-[11px]">{error}</p>
                            <button onClick={() => loadData(false)} className="mt-2 text-[10px] font-bold underline focus-visible:outline focus-visible:outline-1 rounded">Retry</button>
                        </div>
                    ) : filteredItems.length > 0 ? (
                        <div className="columns-1 sm:columns-2 gap-3">
                            {filteredItems.map((item: ScratchpadItem) => (
                                <MasonryCard
                                    key={logNumbers.get(item)}
                                    item={item}
                                    logNumber={logNumbers.get(item) ?? 0}
                                    isActive={selectedLog === item}
                                    onClick={handleCardClick}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center" role="status">
                            <Icon icon="lucide:inbox" width="24" className="text-neutral-300 dark:text-neutral-700 mb-2" aria-hidden="true" />
                            <p className="text-xs text-neutral-500">No logs match your search</p>
                            {(selectedTag !== 'All' || searchQuery) && (
                                <button onClick={() => { setSelectedTag('All'); setSearchQuery('') }} className="mt-2 text-xs font-semibold underline text-neutral-600 dark:text-neutral-300 focus-visible:outline focus-visible:outline-1 rounded">
                                    Clear filters
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* ══ RIGHT: Preview panel ══════════════════════════════════════════ */}
            <main
                aria-label="Log preview"
                className={`min-h-0 overflow-hidden
                    ${isMobilePreviewOpen ? 'flex flex-col flex-1 w-full' : 'hidden md:flex md:flex-col md:flex-1'}`}
            >
                {selectedLog ? (
                    <PreviewPanel
                        log={selectedLog}
                        logNumber={logNumber}
                        onBack={() => setIsMobilePreviewOpen(false)}
                    />
                ) : (
                    <div className="h-full flex items-center justify-center w-full" aria-hidden="true">
                        <div className="text-center">
                            <Icon icon="lucide:mouse-pointer-click" width="28" className="text-neutral-300 dark:text-neutral-700 mx-auto mb-2" />
                            <p className="text-xs text-neutral-400 dark:text-neutral-500">Select a log to preview</p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}

export default React.memo(ScratchpadExpanded)
