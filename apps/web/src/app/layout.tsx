import type { Metadata } from 'next'
import { Inter as FontSans } from 'next/font/google'
import type { PropsWithChildren } from 'react'

import { cn } from '@/utils/cn'
import './globals.css'

export const metadata: Metadata = {
  title: {
    template: '%s | WhatShare',
    default: 'WhatShare',
  },
}

export const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

type LayoutProps = Readonly<PropsWithChildren>

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable,
        )}
      >
        <div className="h-lvh">{children}</div>
      </body>
    </html>
  )
}
