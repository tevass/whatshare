'use client'

import * as Primitive from '@radix-ui/react-select'
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from 'react'

import { cn } from '@/utils/cn'

type SelectTriggerIconRef = ElementRef<typeof Primitive.Icon>

export type SelectTriggerIconProps = ComponentPropsWithoutRef<
  typeof Primitive.Icon
>

export const SelectTriggerIcon = forwardRef<
  SelectTriggerIconRef,
  SelectTriggerIconProps
>(({ className, ...props }, ref) => {
  return (
    <Primitive.Icon
      ref={ref}
      className={cn('size-4 opacity-50', className)}
      asChild
      {...props}
    />
  )
})
SelectTriggerIcon.displayName = Primitive.Icon.displayName
