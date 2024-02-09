'use client'

import { cn } from '@/utils/cn'
import * as Primitive from '@radix-ui/react-scroll-area'
import { ComponentPropsWithRef, ElementRef, forwardRef } from 'react'

type ScrollAreaThumbRef = ElementRef<typeof Primitive.ScrollAreaThumb>
export type ScrollAreaThumbProps = ComponentPropsWithRef<
  typeof Primitive.ScrollAreaThumb
>

export const ScrollAreaThumb = forwardRef<
  ScrollAreaThumbRef,
  ScrollAreaThumbProps
>(({ className, ...props }, ref) => {
  return (
    <Primitive.ScrollAreaThumb
      ref={ref}
      className={cn('relative flex-1 rounded-full bg-border', className)}
      {...props}
    />
  )
})
ScrollAreaThumb.displayName = 'ScrollArea.Thumb'
