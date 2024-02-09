'use client'

import { ElementRef, forwardRef } from 'react'
import { ScrollArea, ScrollAreaProps } from './scroll-area'

type ScrollRef = ElementRef<typeof ScrollArea.Root>
type ScrollProps = ScrollAreaProps

export const Scroll = forwardRef<ScrollRef, ScrollProps>(
  ({ children, ...props }, ref) => {
    return (
      <ScrollArea.Root ref={ref} {...props}>
        <ScrollArea.ViewPort>{children}</ScrollArea.ViewPort>

        <ScrollArea.Scrollbar>
          <ScrollArea.Thumb />
        </ScrollArea.Scrollbar>

        <ScrollArea.Corner />
      </ScrollArea.Root>
    )
  },
)
Scroll.displayName = ScrollArea.Root.displayName
