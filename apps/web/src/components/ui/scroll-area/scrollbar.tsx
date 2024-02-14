import * as Primitive from '@radix-ui/react-scroll-area'
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from 'react'

import { ScrollAreaThumb } from './thumb'

import { cn } from '@/utils/cn'

type ScrollAreaScrollbarRef = ElementRef<typeof Primitive.ScrollAreaScrollbar>

export type ScrollAreaScrollbarProps = ComponentPropsWithoutRef<
  typeof Primitive.ScrollAreaScrollbar
>

export const ScrollAreaScrollbar = forwardRef<
  ScrollAreaScrollbarRef,
  ScrollAreaScrollbarProps
>(({ className, orientation, ...props }, ref) => {
  return (
    <Primitive.ScrollAreaScrollbar
      ref={ref}
      orientation={orientation}
      className={cn(
        'flex touch-none select-none transition-colors',
        orientation === 'vertical' &&
          'h-full w-2 border-l border-l-transparent px-px py-1',
        orientation === 'horizontal' &&
          'h-2 flex-col border-t border-t-transparent py-px px-1',
        className,
      )}
      {...props}
    >
      <ScrollAreaThumb />
    </Primitive.ScrollAreaScrollbar>
  )
})
ScrollAreaScrollbar.displayName = Primitive.ScrollAreaScrollbar.displayName

ScrollAreaScrollbar.defaultProps = {
  orientation: 'vertical',
}
