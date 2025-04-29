'use client'

import React from 'react'
import { Layout, Layouts, Responsive, WidthProvider } from 'react-grid-layout'
import { useResponsiveRowHeight } from '@/lib/hooks/useResponsiveRowHeight'
import ReactGridCard from '@/components/react-grid/ReactGridCard'
import ProfileCard from '@/app/home/components/ProfileCard'
import ExperienceCard from '@/app/home/components/ExperienceCard'
import SkillsCard from '@/app/home/components/SkillsCard'
import ProjectsCard from '@/app/home/components/ProjectsCard'
import GithubStatsCard from '@/app/home/components/GithubStatsCard'
import GithubContributionGraph from '@/app/home/components/GithubContributionGraphCard'
import QuoteCard from '@/app/home/components/QuoteCard'
import BlogCard from '@/app/home/components/BlogCard'
import Weblog from '@/app/weblog/Weblog'

interface GridState {
    static: boolean
    isResizable: boolean
    isDraggable: boolean
}

const ResponsiveGridLayout = WidthProvider(Responsive)

export default function Home() {
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
            { w: 2, h: 2, x: 0, y: 0, i: '1', static: editable.static, isResizable: editable.isResizable, isDraggable: editable.isDraggable },
            { w: 2, h: 1, x: 0, y: 3, i: '2', static: editable.static, isResizable: editable.isResizable, isDraggable: editable.isDraggable },
            { w: 2, h: 1, x: 0, y: 3, i: '3', static: editable.static, isResizable: editable.isResizable, isDraggable: editable.isDraggable },
            { w: 1, h: 2, x: 1, y: 4, i: '4', static: editable.static, isResizable: editable.isResizable, isDraggable: editable.isDraggable },
            { w: 1, h: 2, x: 0, y: 4, i: '5', static: editable.static, isResizable: editable.isResizable, isDraggable: editable.isDraggable },
            { w: 2, h: 1, x: 0, y: 6, i: '6', static: editable.static, isResizable: editable.isResizable, isDraggable: editable.isDraggable },
            { w: 2, h: 1, x: 0, y: 7, i: '7', static: editable.static, isResizable: editable.isResizable, isDraggable: editable.isDraggable },
            { w: 2, h: 1, x: 0, y: 2, i: '8', static: editable.static, isResizable: editable.isResizable, isDraggable: editable.isDraggable },
        ],
        md: [
            { i: '1', x: 0, y: 0, w: 2, h: 2, static: editable.static, isResizable: editable.isResizable, isDraggable: editable.isDraggable },
            { i: '2', x: 2, y: 0, w: 1, h: 1, static: editable.static, isResizable: editable.isResizable, isDraggable: editable.isDraggable },
            { i: '3', x: 3, y: 3, w: 1, h: 1, static: editable.static, isResizable: editable.isResizable, isDraggable: editable.isDraggable },
            { i: '4', x: 3, y: 0, w: 1, h: 2, static: editable.static, isResizable: editable.isResizable, isDraggable: editable.isDraggable },
            { i: '5', x: 2, y: 1, w: 1, h: 2, static: editable.static, isResizable: editable.isResizable, isDraggable: editable.isDraggable },
            { i: '6', x: 3, y: 2, w: 1, h: 1, static: editable.static, isResizable: editable.isResizable, isDraggable: editable.isDraggable },
            { i: '7', x: 0, y: 2, w: 2, h: 1, static: editable.static, isResizable: editable.isResizable, isDraggable: editable.isDraggable },
            { i: '8', x: 0, y: 3, w: 3, h: 1, static: editable.static, isResizable: editable.isResizable, isDraggable: editable.isDraggable },
        ],
        lg: [
            { i: '1', x: 0, y: 0, w: 2, h: 1, static: editable.static, isResizable: editable.isResizable, isDraggable: editable.isDraggable },
            { i: '2', x: 2, y: 0, w: 1, h: 1, static: editable.static, isResizable: editable.isResizable, isDraggable: editable.isDraggable },
            { i: '3', x: 0, y: 1, w: 1, h: 1, static: editable.static, isResizable: editable.isResizable, isDraggable: editable.isDraggable },
            { i: '4', x: 3, y: 0, w: 1, h: 2, static: editable.static, isResizable: editable.isResizable, isDraggable: editable.isDraggable },
            { i: '5', x: 2, y: 1, w: 1, h: 2, static: editable.static, isResizable: editable.isResizable, isDraggable: editable.isDraggable },
            { i: '6', x: 3, y: 2, w: 1, h: 1, static: editable.static, isResizable: editable.isResizable, isDraggable: editable.isDraggable },
            { i: '7', x: 0, y: 2, w: 2, h: 1, static: editable.static, isResizable: editable.isResizable, isDraggable: editable.isDraggable },
            { i: '8', x: 1, y: 1, w: 1, h: 1, static: editable.static, isResizable: editable.isResizable, isDraggable: editable.isDraggable },
        ],
    }

    return (
        <main className="min-h-screen transition-all">
            <div>
                <ResponsiveGridLayout
                    layouts={layouts}
                    breakpoints={breakpoints}
                    cols={cols}
                    rowHeight={rowHeight}
                    compactType="vertical"
                    margin={[16, 16]}
                    containerPadding={[16, 16]}
                    className="grid-container"
                >
                    <ReactGridCard key="1" id="1">
                        <ProfileCard />
                    </ReactGridCard>
                    <ReactGridCard key="2" id="2" className="p-2 md:p-4 lg:p-6">
                        <ExperienceCard />
                    </ReactGridCard>
                    <ReactGridCard key="3" id="3" className="p-2 md:p-4 lg:p-6">
                        <GithubStatsCard />
                    </ReactGridCard>
                    <ReactGridCard key="4" id="4" isExpandable>
                        <SkillsCard />
                    </ReactGridCard>
                    <ReactGridCard key="5" id="5" isExpandable className="p-2 md:p-4 lg:p-6">
                        <ProjectsCard />
                    </ReactGridCard>
                    <ReactGridCard key="6" id="6" isExpandable className="p-2 md:p-4 lg:p-6">
                        <BlogCard/>
                    </ReactGridCard>
                    <ReactGridCard key="7" id="7" isExpandable className="p-2 md:p-4 lg:p-6 h-full">
                        <GithubContributionGraph />
                    </ReactGridCard>
                    <ReactGridCard key="8" id="8" isExpandable className="p-2 md:p-4 lg:p-6 h-full">
                        <QuoteCard />
                    </ReactGridCard>
                </ResponsiveGridLayout>
            </div>
            <div className='grid-container'>
                <Weblog/>
            </div>
        </main>
    )
}
