import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'JetSki - Turn Podcasts into Comics',
  description: 'AI-powered YouTube to comic converter. Turn 3-hour podcasts into 6-panel comics in 2 minutes.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
