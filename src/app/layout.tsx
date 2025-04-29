import type { Metadata } from 'next'
import data from '@/data/data.json'
import { ThemeProvider } from '@/lib/provider/ThemeProvider'
import Footer from '@/components/Footer'
import { Quicksand, Afacad, Ubuntu_Mono } from 'next/font/google'

// CSS
import './globals.css'
import './custom.css'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

const quicksand = Quicksand({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700'],
    variable: '--font-quicksand',
    display: 'swap',
    adjustFontFallback: false,
    preload: true
})

const afacad = Afacad({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    variable: '--font-afacad',
    display: 'swap',
    adjustFontFallback: false,
    preload: true
})

const ubuntu_mono = Ubuntu_Mono({
    subsets: ['latin'],
    weight: ['400', '700'],
    variable: '--font-ubuntu-mono',
    display: 'swap',
    adjustFontFallback: false,
    preload: true
})

export const metadata: Metadata = data.metadata

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${quicksand.variable} ${afacad.variable} ${ubuntu_mono.variable} antialiased container mx-auto`}>
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
