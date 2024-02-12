'use client'

import * as Primitive from '@radix-ui/react-select'
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from 'react'

import { cn } from '@/utils/cn'

type SelectSeparatorRef = ElementRef<typeof Primitive.Separator>

export type SelectSeparatorProps = ComponentPropsWithoutRef<
  typeof Primitive.Separator
>

export const SelectSeparator = forwardRef<
  SelectSeparatorRef,
  SelectSeparatorProps
>(({ className, ...props }, ref) => {
  return (
    <Primitive.Separator
      ref={ref}
      className={cn('-mx-1 my-1 h-px bg-muted', className)}
      {...props}
    />
  )
})
SelectSeparator.displayName = Primitive.Separator.displayName
