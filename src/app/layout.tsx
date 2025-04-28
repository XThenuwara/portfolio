import type { Metadata } from 'next'
import data from '@/data/data.json'
import { ThemeProvider } from '@/lib/provider/theme-provider'
import Footer from '@/components/Footer'

// CSS
import './globals.css'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

export const metadata: Metadata = data.metadata

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <body className="container mx-auto p-4">
                <ThemeProvider>
                    <section className="my-8 h-full">{children}</section>
                    <Footer />
                </ThemeProvider>
            </body>
        </html>
    )
}
