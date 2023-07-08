import { Sidebar } from '@/components/Sidebar'
import './globals.css'
import type { Metadata } from 'next'
import { Figtree, Inter } from 'next/font/google'

// const inter = Inter({ subsets: ["latin"] });
const font = Figtree({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Spotify Clone',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={font.className}>
                <Sidebar>{children}</Sidebar>
            </body>
        </html>
    )
}
