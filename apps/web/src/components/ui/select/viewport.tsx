'use client'

import * as Primitive from '@radix-ui/react-select'
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from 'react'

import { cn } from '@/utils/cn'
import { SelectContentProps } from './content'

type SelectViewportRef = ElementRef<typeof Primitive.Viewport>

export type SelectViewportProps = ComponentPropsWithoutRef<
  typeof Primitive.Viewport
> &
  Pick<SelectContentProps, 'position'>

export const SelectViewport = forwardRef<
  SelectViewportRef,
  SelectViewportProps
>(({ className, position, ...props }, ref) => {
  return (
    <Primitive.Viewport
      ref={ref}
      className={cn(
        'p-1',
        position === 'popper' &&
          'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]',
        className,
      )}
      {...props}
    />
  )
})
SelectViewport.displayName = Primitive.Viewport.displayName
