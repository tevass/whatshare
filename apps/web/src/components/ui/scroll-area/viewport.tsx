import * as Primitive from '@radix-ui/react-scroll-area'
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from 'react'

import { cn } from '@/utils/cn'

type ScrollAreaViewportRef = ElementRef<typeof Primitive.ScrollAreaViewport>

export type ScrollAreaViewportProps = ComponentPropsWithoutRef<
  typeof Primitive.ScrollAreaViewport
>

export const ScrollAreaViewport = forwardRef<
  ScrollAreaViewportRef,
  ScrollAreaViewportProps
>(({ className, ...props }, ref) => {
  return (
    <Primitive.ScrollAreaViewport
      ref={ref}
      className={cn('h-full w-full rounded-[inherit]', className)}
      {...props}
    />
  )
})
ScrollAreaViewport.displayName = Primitive.ScrollAreaViewport.displayName
