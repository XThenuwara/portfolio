'use client'

import React from 'react'
import { Layout, Layouts, Responsive, WidthProvider } from 'react-grid-layout'
import { useResponsiveRowHeight } from '@/lib/hooks/useResponsiveRowHeight'
import ReactGridCard from '@/components/react-grid/ReactGridCard'
import ProfileCard from '@/app/home/components/ProfileCard'
import ExperienceCard from '@/app/home/components/ExperienceCard'
import SkillsCard from '@/app/home/components/SkillsCard'
import ProjectsCard from '@/app/home/components/ProjectsCard'
import QuoteCard from '@/app/home/components/QuoteCard'
import ExperienceTimeline from '@/app/home/components/ExperienceTimeline'
import dynamic from 'next/dynamic'
import LoadingSpinner from '@/components/LoadingSpinner'

interface GridState {
    static: boolean
    isResizable: boolean
    isDraggable: boolean
}

const ResponsiveGridLayout = WidthProvider(Responsive)

// Dynamic Import
const GithubContributionGraph = dynamic(() => import('@/app/home/components/GithubContributionGraphCard'), {
    loading: () => <LoadingSpinner />,
    ssr: false,
})

const GithubStatsCard = dynamic(() => import('@/app/home/components/GithubStatsCard'), {
    loading: () => <LoadingSpinner />,
    ssr: false,
})

const Weblog = dynamic(() => import('@/app/weblog/Weblog'), {
    loading: () => <LoadingSpinner />,
    ssr: false,
})

const BlogCard = dynamic(() => import('@/app/home/components/BlogCard'), {
    loading: () => <LoadingSpinner />,
    ssr: false,
})

export default function Home() {
    const [mounted, setMounted] = React.useState(false)
    const [editable] = React.useState<GridState>({
        static: true,
        isResizable: false,
        isDraggable: false,
    })
    const breakpoints = { lg: 996, md: 768, sm: 578 }
    const cols = { lg: 4, md: 4, sm: 2 }
    const rowHeight = useResponsiveRowHeight(breakpoints)

    const layouts: Layouts = {
        sm: [
            { w: 2, h: 2, x: 0, y: 0, i: '1', static: true },
            { w: 2, h: 1, x: 0, y: 3, i: '2', static: true },
            { w: 2, h: 1, x: 0, y: 3, i: '3', static: true },
            { w: 1, h: 2, x: 1, y: 4, i: '4', static: true },
            { w: 1, h: 2, x: 0, y: 4, i: '5', static: true },
            { w: 2, h: 1, x: 0, y: 6, i: '6', static: true },
            { w: 2, h: 1, x: 0, y: 7, i: '7', static: true },
            { w: 2, h: 1, x: 0, y: 2, i: '8', static: true },
        ],
        md: [
            { i: '1', x: 0, y: 0, w: 2, h: 2, static: true },
            { i: '2', x: 2, y: 0, w: 1, h: 1, static: true },
            { i: '3', x: 3, y: 3, w: 1, h: 1, static: true },
            { i: '4', x: 3, y: 0, w: 1, h: 2, static: true },
            { i: '5', x: 2, y: 1, w: 1, h: 2, static: true },
            { i: '6', x: 3, y: 2, w: 1, h: 1, static: true },
            { i: '7', x: 0, y: 2, w: 2, h: 1, static: true },
            { i: '8', x: 0, y: 3, w: 3, h: 1, static: true },
        ],
        lg: [
            { i: '1', x: 0, y: 0, w: 2, h: 1, static: true },
            { i: '2', x: 2, y: 0, w: 1, h: 1, static: true },
            { i: '3', x: 0, y: 1, w: 1, h: 1, static: true },
            { i: '4', x: 3, y: 0, w: 1, h: 2, static: true },
            { i: '5', x: 2, y: 1, w: 1, h: 2, static: true },
            { i: '6', x: 3, y: 2, w: 1, h: 1, static: true },
            { i: '7', x: 0, y: 2, w: 2, h: 1, static: true },
            { i: '8', x: 1, y: 1, w: 1, h: 1, static: true },
        ],
    }

    const memoizedLayouts = React.useMemo(
        () => ({
            sm: layouts.sm,
            md: layouts.md,
            lg: layouts.lg,
        }),
        [editable.static, layouts.sm, layouts.md, layouts.lg]
    )

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return <div className="min-h-screen" />
    }

    return (
        <main className="min-h-screen transition-all">
            <div className="relative w-full">
                <React.Suspense fallback={<LoadingSpinner />}>
                    <ResponsiveGridLayout
                        layouts={memoizedLayouts}
                        breakpoints={breakpoints}
                        cols={cols}
                        compactType="vertical"
                        margin={[16, 16]}
                        rowHeight={rowHeight}
                        autoSize={true}
                        containerPadding={[16, 16]}
                        className="grid-container"
                        useCSSTransforms={true}
                        isResizable={false}
                    >
                        <ReactGridCard key="1" id="1">
                            <ProfileCard />
                        </ReactGridCard>
                        <ReactGridCard key="2" id="2" isExpandable expandedContent={<ExperienceTimeline />} className="p-4 md:p-4 lg:p-6">
                            <ExperienceCard />
                        </ReactGridCard>
                        <ReactGridCard key="3" id="3" isExpandable className="p-4 md:p-4 lg:p-6">
                            <GithubStatsCard />
                        </ReactGridCard>
                        <ReactGridCard key="4" id="4" isExpandable>
                            <SkillsCard />
                        </ReactGridCard>
                        <ReactGridCard key="5" id="5" isExpandable className="p-2 md:p-4 lg:p-6">
                            <ProjectsCard />
                        </ReactGridCard>
                        <ReactGridCard key="6" id="6" isExpandable className="p-4 md:p-4 lg:p-6">
                            <BlogCard />
                        </ReactGridCard>
                        <ReactGridCard key="7" id="7" isExpandable className="p-2 md:p-4 lg:p-6 h-full">
                            <GithubContributionGraph />
                        </ReactGridCard>
                        <ReactGridCard key="8" id="8" isExpandable className="p-2 md:p-4 lg:p-6 h-full">
                            <QuoteCard />
                        </ReactGridCard>
                    </ResponsiveGridLayout>
                </React.Suspense>
            </div>
            <div className="grid-container">
                <React.Suspense fallback={<LoadingSpinner />}>
                    <Weblog />
                </React.Suspense>
            </div>
        </main>
    )
}
