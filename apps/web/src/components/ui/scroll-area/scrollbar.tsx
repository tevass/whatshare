'use client'

import { cn } from '@/utils/cn'
import * as Primitive from '@radix-ui/react-scroll-area'
import { VariantProps, cva } from 'class-variance-authority'
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

const scrollAreaVariants = cva(
  'flex touch-none select-none transition-colors',
  {
    variants: {
      orientation: {
        vertical: 'h-full w-1.5 border-l border-l-transparent py-1 px-px',
        horizontal: 'h-1.5 flex-col border-t border-t-transparent px-1 py-px',
      },
    },
    defaultVariants: {
      orientation: 'vertical',
    },
  },
)

type ScrollAreaVariantProps = VariantProps<typeof scrollAreaVariants>

type ScrollAreaScrollbarRef = ElementRef<typeof Primitive.ScrollAreaScrollbar>
export type ScrollAreaScrollbarProps = ComponentPropsWithoutRef<
  typeof Primitive.ScrollAreaScrollbar
> &
  ScrollAreaVariantProps

export const ScrollAreaScrollbar = forwardRef<
  ScrollAreaScrollbarRef,
  ScrollAreaScrollbarProps
>(({ className, orientation = 'vertical', ...props }, ref) => {
  return (
    <Primitive.ScrollAreaScrollbar
      ref={ref}
      orientation={orientation}
      className={cn(scrollAreaVariants({ orientation, className }))}
      {...props}
    />
  )
})
ScrollAreaScrollbar.displayName = 'ScrollArea.Scrollbar'
