'use client'

import * as Primitive from '@radix-ui/react-scroll-area'
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from 'react'

import { cn } from '@/utils/cn'
import { ScrollAreaCorner } from './corner'
import { ScrollAreaScrollbar } from './scrollbar'
import { ScrollAreaViewport } from './viewport'

type ScrollAreaRef = ElementRef<typeof Primitive.Root>

export type ScrollAreaProps = ComponentPropsWithoutRef<typeof Primitive.Root>

export const ScrollArea = forwardRef<ScrollAreaRef, ScrollAreaProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Primitive.Root
        ref={ref}
        className={cn('relative overflow-hidden', className)}
        {...props}
      >
        <ScrollAreaViewport>{children}</ScrollAreaViewport>
        <ScrollAreaScrollbar />
        <ScrollAreaCorner />
      </Primitive.Root>
    )
  },
)
ScrollArea.displayName = Primitive.ScrollArea.displayName
