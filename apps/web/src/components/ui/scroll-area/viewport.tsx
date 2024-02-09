'use client'

import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'
import * as Primitive from '@radix-ui/react-scroll-area'
import { cn } from '@/utils/cn'

type ScrollAreaViewPortRef = ElementRef<typeof Primitive.Viewport>
export type ScrollAreaViewPortProps = ComponentPropsWithoutRef<
  typeof Primitive.Viewport
>

export const ScrollAreaViewPort = forwardRef<
  ScrollAreaViewPortRef,
  ScrollAreaViewPortProps
>(({ className, ...props }, ref) => {
  return (
    <Primitive.Viewport
      ref={ref}
      className={cn('h-full w-full rounded-[inherit]', className)}
      {...props}
    />
  )
})
ScrollAreaViewPort.displayName = 'ScrollArea.ViewPort'
