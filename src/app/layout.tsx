import type { Metadata } from 'next'
import data from '@/data/data.json'
import { ThemeProvider } from '@/lib/provider/ThemeProvider'
import Footer from '@/components/Footer'

// CSS
import './globals.css'
import './custom.css'
import Script from 'next/script'

export const metadata: Metadata = data.metadata

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                {/* <script src="https://unpkg.com/react-scan/dist/auto.global.js" /> */}
                <Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-E78BVRJRF5" />
                <Script id="google-analytics">
                        {` 
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            gtag('js', new Date());

                            gtag('config', 'G-E78BVRJRF5');
                        `}
                </Script>
                {/* Preconnect to external origins */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link rel="preconnect" href="https://api.github.com" />
                <link rel="preconnect" href="https://github-contributions-api.jogruber.de" />
                <link rel="dns-prefetch" href="https://www.google-analytics.com" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Afacad:ital,wght@0,400..700;1,400..700&family=Quicksand:wght@300..700&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className="antialiased container mx-auto" suppressHydrationWarning>
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
