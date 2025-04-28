'use client'

import React from 'react'
import { Layout, Layouts, Responsive, WidthProvider } from 'react-grid-layout'
import ReactGridCard from '../components/react-grid/ReactGridCard'
import ProfileCard from './components/ProfileCard'
import { useResponsiveRowHeight } from '@/lib/hooks/useResponsiveRowHeight'
import ExperienceCard from './components/ExperienceCard'

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
            { w: 1, h: 2, x: 0, y: 5, i: '5', static: editable.static, isResizable: editable.isResizable, isDraggable: editable.isDraggable },
            { w: 1, h: 1, x: 1, y: 6, i: '6', static: editable.static, isResizable: editable.isResizable, isDraggable: editable.isDraggable },
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
                    className='grid-container'
                >
                    <ReactGridCard key="1">
                        <ProfileCard />
                    </ReactGridCard>
                    <ReactGridCard key="2">
                        <ExperienceCard />
                    </ReactGridCard>
                </ResponsiveGridLayout>
            </div>
        </main>
    )
}
