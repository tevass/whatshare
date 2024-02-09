'use client'

import * as Primitive from '@radix-ui/react-scroll-area'
import { ComponentPropsWithRef, ElementRef, forwardRef } from 'react'

import { cn } from '@/utils/cn'

type ScrollAreaRef = ElementRef<typeof Primitive.Root>
export type ScrollAreaProps = ComponentPropsWithRef<typeof Primitive.Root>

export const ScrollArea = forwardRef<ScrollAreaRef, ScrollAreaProps>(
  ({ className, ...props }, ref) => {
    return (
      <Primitive.Root
        ref={ref}
        className={cn('relative overflow-hidden', className)}
        {...props}
      />
    )
  },
)
ScrollArea.displayName = 'ScrollArea'
