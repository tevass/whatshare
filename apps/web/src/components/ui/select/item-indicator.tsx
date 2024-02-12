'use client'

import * as Primitive from '@radix-ui/react-select'
import { cva, type VariantProps } from 'class-variance-authority'
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from 'react'

import { cn } from '@/utils/cn'

const selectItemIndicatorVariants = cva(
  'absolute flex size-3.5 items-center justify-center',
  {
    variants: {
      align: {
        start: 'left-2',
        end: 'right-2',
      },
    },
    defaultVariants: {
      align: 'start',
    },
  },
)

type SelectItemIndicatorVariants = VariantProps<
  typeof selectItemIndicatorVariants
>

type SelectItemIndicatorRef = ElementRef<typeof Primitive.ItemIndicator>

export interface SelectItemIndicatorProps
  extends ComponentPropsWithoutRef<typeof Primitive.ItemIndicator>,
    SelectItemIndicatorVariants {}

export const SelectItemIndicator = forwardRef<
  SelectItemIndicatorRef,
  SelectItemIndicatorProps
>(({ className, align, ...props }, ref) => {
  return (
    <Primitive.ItemIndicator
      ref={ref}
      className={cn(selectItemIndicatorVariants({ align, className }))}
      {...props}
    />
  )
})
SelectItemIndicator.displayName = Primitive.ItemIndicator.displayName
