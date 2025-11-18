import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Tehran Soft - Industrial Motion Logo',
  description: 'Modern industrial motion logo with scaffolding theme',
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
