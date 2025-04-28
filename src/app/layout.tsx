import type { Metadata } from 'next'
import data from '@/data/data.json'
import { ThemeProvider } from '@/lib/provider/ThemeProvider'
import Footer from '@/components/Footer'
import { Quicksand, Afacad } from 'next/font/google'

// CSS
import './globals.css'
import './custom.css'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

const quicksand = Quicksand({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700'],
    variable: '--font-quicksand',
})

const afacad = Afacad({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    variable: '--font-afacad',
})

export const metadata: Metadata = data.metadata

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${quicksand.variable} ${afacad.variable} antialiased container mx-auto`}>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                    <div className="transition-colors duration-100 ease-in-out">
                        <section className="my-8 h-full">{children}</section>
                        <Footer />
                    </div>
                </ThemeProvider>
            </body>
        </html>
    )
}
