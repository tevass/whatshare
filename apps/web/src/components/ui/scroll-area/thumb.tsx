import * as Primitive from '@radix-ui/react-scroll-area'
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from 'react'

import { cn } from '@/utils/cn'

type ScrollAreaThumbRef = ElementRef<typeof Primitive.ScrollAreaThumb>

export type ScrollAreaThumbProps = ComponentPropsWithoutRef<
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
ScrollAreaThumb.displayName = Primitive.ScrollAreaThumb.displayName
