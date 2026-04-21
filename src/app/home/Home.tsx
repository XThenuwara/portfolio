'use client'

import React from 'react'
import { Layouts, Responsive, WidthProvider } from 'react-grid-layout'
import { useResponsiveRowHeight } from '@/lib/hooks/useResponsiveRowHeight'
import ReactGridCard from '@/components/react-grid/ReactGridCard'
import ProfileCard from '@/app/home/components/ProfileCard'
import ExperienceCard from '@/app/home/components/ExperienceCard'
import SkillsCard from '@/app/home/components/SkillsCard'
import ProjectsCard from '@/app/home/components/ProjectsCard'
import QuoteCard from '@/app/home/components/QuoteCard'
import ExperienceTimeline from '@/app/home/components/ExperienceTimeline'
import dynamic from 'next/dynamic'

// Grid CSS — loaded only on the home page, not globally
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

const ResponsiveGridLayout = WidthProvider(Responsive)

const GridSkeleton = () => <div className="h-full w-full rounded-sm border bg-card/50 animate-pulse" />

// Dynamic Imports with Skeleton placeholders
const CVDownloadCard = dynamic(() => import('@/app/home/components/CVDownloadCard'), {
    loading: () => <GridSkeleton />,
    ssr: false,
})

const GithubContributionGraph = dynamic(() => import('@/app/home/components/GithubContributionGraphCard'), {
    loading: () => <GridSkeleton />,
    ssr: false,
})

const Weblog = dynamic(() => import('@/app/weblog/Weblog'), {
    loading: () => <div className="w-full h-96 bg-card/20 animate-pulse rounded-lg" />,
    ssr: false,
})

const BlogCard = dynamic(() => import('@/app/home/components/BlogCard'), {
    loading: () => <GridSkeleton />,
    ssr: false,
})

const CVPreview = dynamic(() => import('@/app/home/components/CVPreview'), {
    loading: () => <GridSkeleton />,
    ssr: false,
})

export default function Home() {
    const breakpoints = { lg: 996, md: 768, sm: 578 }
    const cols = { lg: 4, md: 4, sm: 2 }
    const rowHeight = useResponsiveRowHeight(breakpoints)

    const memoizedLayouts = React.useMemo<Layouts>(
        () => ({
            sm: [
                { i: '1', x: 0, y: 0, w: 2, h: 2, static: true },
                { i: '8', x: 0, y: 2, w: 2, h: 1, static: true },
                { i: '2', x: 0, y: 3, w: 2, h: 1, static: true },
                { i: '3', x: 0, y: 4, w: 2, h: 1, static: true },
                { i: '5', x: 0, y: 5, w: 1, h: 2, static: true },
                { i: '4', x: 1, y: 5, w: 1, h: 2, static: true },
                { i: '6', x: 0, y: 7, w: 2, h: 1, static: true },
                { i: '7', x: 0, y: 8, w: 2, h: 1, static: true },
            ],
            md: [
                { i: '1', x: 0, y: 0, w: 2, h: 2, static: true },
                { i: '2', x: 2, y: 0, w: 1, h: 1, static: true },
                { i: '4', x: 3, y: 0, w: 1, h: 2, static: true },
                { i: '5', x: 2, y: 1, w: 1, h: 2, static: true },
                { i: '3', x: 0, y: 2, w: 1, h: 1, static: true },
                { i: '8', x: 1, y: 2, w: 1, h: 1, static: true },
                { i: '6', x: 3, y: 2, w: 1, h: 1, static: true },
                { i: '7', x: 0, y: 3, w: 4, h: 1, static: true },
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
        }),
        []
    )

    return (
        <main className="min-h-screen transition-all" suppressHydrationWarning>
            <div className="relative w-full">
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
                    // onLayoutChange={(layout) => console.log(layout)}
                >
                    <ReactGridCard key="1" id="1">
                        <ProfileCard />
                    </ReactGridCard>
                    <ReactGridCard key="2" id="2" isExpandable expandedContent={<ExperienceTimeline />} className="p-4 md:p-4 lg:p-6">
                        <ExperienceCard />
                    </ReactGridCard>
                    <ReactGridCard key="3" id="3" isExpandable expandedContent={<CVPreview />} className="p-4 md:p-4 lg:p-6">
                        <CVDownloadCard />
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
                    <ReactGridCard key="7" id="7" isExpandable className="p-2 md:p-4 lg:p-6 h-full text-xs">
                        <GithubContributionGraph />
                    </ReactGridCard>
                    <ReactGridCard key="8" id="8" isExpandable className="p-2 md:p-4 lg:p-6 h-full">
                        <QuoteCard />
                    </ReactGridCard>
                </ResponsiveGridLayout>
            </div>
            <div className="grid-container">
                <Weblog />
            </div>
        </main>
    )
}
