import type { Metadata } from 'next'
import data from '@/data/data.json'
import { ThemeProvider } from '@/lib/provider/ThemeProvider'
import Footer from '@/components/Footer'

// CSS
import './globals.css'
import './custom.css'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

export const metadata: Metadata = data.metadata

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Afacad:ital,wght@0,400..700;1,400..700&family=Quicksand:wght@300..700&display=swap" rel="stylesheet" />
            </head>
            <body className={`antialiased container mx-auto`}>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                    <div className="transition-colors duration-100 ease-in-out pb-8 w-full">
                        <section className="my-8 h-full">{children}</section>
                        <Footer />
                    </div>
                </ThemeProvider>
            </body>
        </html>
    )
}
