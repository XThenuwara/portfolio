'use client'

import React, { useEffect, useState } from 'react'
import { fetchGoogleDoc, getGoogleDocId, ScratchpadContent, ScratchpadItem } from '@/service/scratchpad.service'
import { Icon } from '@iconify/react/dist/iconify.js'
import LoadingSpinner from '@/components/LoadingSpinner'

const ScratchpadCard = () => {
    const [content, setContent] = useState<ScratchpadContent | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const docId = getGoogleDocId()

    const latestItems = React.useMemo(() => {
        if (!content?.items) return []
        return content.items.slice(0, 3)
    }, [content?.items])

    useEffect(() => {
        if (!docId) { setLoading(false); return }
        let cancelled = false
        fetchGoogleDoc().then(data => {
            if (!cancelled) { setContent(data); setError(null); setLoading(false) }
        }).catch(err => {
            if (!cancelled) { setError('Unable to load live snippets.'); setLoading(false) }
        })
        return () => { cancelled = true }
    }, [docId])

    if (!docId) return (
        <div className="h-full w-full flex flex-col justify-between p-4 select-none">
            <div>
                <div className="flex items-center gap-2 mb-2 text-neutral-400">
                    <Icon icon="tabler:notebook" width="15" />
                    <span className="text-[10px] font-bold tracking-widest uppercase">Scratchpad</span>
                </div>
                <h3 className="text-base font-bold text-neutral-800 dark:text-neutral-200">Connect your Google Doc</h3>
                <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
                    Set <code className="bg-neutral-100 dark:bg-white/8 px-1 rounded text-[10px]">googleDocId</code> in <code className="bg-neutral-100 dark:bg-white/8 px-1 rounded text-[10px]">data.json</code> to show live logs.
                </p>
            </div>
            <p className="text-[9px] text-neutral-400 flex items-center gap-1 mt-2">
                <Icon icon="lucide:info" width="10" />Unconfigured
            </p>
        </div>
    )

    if (loading) return (
        <div className="h-full w-full flex items-center justify-center p-6 select-none" role="status" aria-label="Loading scratchpad">
            <div className="flex flex-col items-center gap-2">
                <LoadingSpinner />
                <span className="text-[11px] text-neutral-400 animate-pulse">Syncing logs…</span>
            </div>
        </div>
    )

    return (
        <div className="h-full w-full flex flex-col p-3 md:p-4 select-none">

            {/* Header */}
            <div className="flex items-center justify-between mb-2 shrink-0">
                <span className="text-[10px] font-bold tracking-widest uppercase text-neutral-500 dark:text-neutral-400">Scratchpad</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
            </div>

            {/* Mini masonry cards */}
            <div className="flex-1 min-h-0 overflow-hidden">
                {error ? (
                    <p className="text-xs text-neutral-500 italic" role="alert">{error}</p>
                ) : latestItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 h-full" role="list" aria-label="Recent scratchpad logs">
                        {latestItems.map((item: ScratchpadItem, idx: number) => (
                            <MiniCard key={idx} item={item} idx={idx} />
                        ))}
                    </div>
                ) : (
                    <p className="text-xs text-neutral-500 italic" role="status">No logs found.</p>
                )}
            </div>

        </div>
    )
}

// Mini card — same visual language as the expanded modal masonry cards
const MiniCard = React.memo(({ item, idx }: { item: ScratchpadItem; idx: number }) => (
    <article
        role="listitem"
        aria-label={[
            item.date ? `Log from ${item.date.split(',')[0]}` : 'Scratchpad log',
            item.tags?.length ? `tagged ${item.tags[0]}` : ''
        ].filter(Boolean).join(', ')}
        className={`
            rounded-xl border border-neutral-200/60 dark:border-white/8
            bg-white/60 dark:bg-neutral-900/40
            overflow-hidden flex flex-col h-full
            transition-all duration-200
            hover:border-neutral-300 dark:hover:border-white/15 hover:shadow-md
            ${idx > 0 ? 'hidden md:flex' : 'flex'}
        `}
    >
        {/* Meta */}
        {(item.date || item.tags?.length > 0) && (
            <div className="flex items-center justify-between gap-1.5 px-3 pt-2.5 pb-0 shrink-0" aria-hidden="true">
                {item.date && (
                    <span className="text-[8.5px] font-semibold text-neutral-400 dark:text-neutral-500 flex items-center gap-0.5">
                        <Icon icon="lucide:calendar" width="8" aria-hidden="true" />
                        <time dateTime={item.date}>{item.date.split(',')[0]}</time>
                    </span>
                )}
                {item.tags?.length > 0 && (
                    <span className="text-[7.5px] font-semibold px-1.5 py-0.5 rounded-full bg-neutral-100 dark:bg-white/5 text-neutral-500 dark:text-neutral-400">
                        {item.tags[0]}
                    </span>
                )}
            </div>
        )}

        {/* Content */}
        <div className="relative flex-1 min-h-0 px-3 py-2 overflow-hidden">
            <div
                className="scratchpad-card-content scratchpad-content text-[10.5px] leading-relaxed text-neutral-700 dark:text-neutral-300"
                dangerouslySetInnerHTML={{ __html: item.html }}
            />
            {/* Fade out bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/90 dark:from-neutral-900/90 to-transparent pointer-events-none" aria-hidden="true" />
        </div>
    </article>
))
MiniCard.displayName = 'MiniCard'

export default React.memo(ScratchpadCard)
