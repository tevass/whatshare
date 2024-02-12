'use client'

import * as Primitive from '@radix-ui/react-select'
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from 'react'

import { cn } from '@/utils/cn'

type SelectLabelRef = ElementRef<typeof Primitive.Label>

export type SelectLabelProps = ComponentPropsWithoutRef<typeof Primitive.Label>

export const SelectLabel = forwardRef<SelectLabelRef, SelectLabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <Primitive.Label
        ref={ref}
        className={cn('py-1.5 pl-8 pr-2 text-sm font-semibold', className)}
        {...props}
      />
    )
  },
)
SelectLabel.displayName = Primitive.Label.displayName
