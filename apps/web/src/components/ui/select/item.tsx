'use client'

import * as Primitive from '@radix-ui/react-select'
import { cva, type VariantProps } from 'class-variance-authority'
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from 'react'

import { cn } from '@/utils/cn'

const selectItemVariants = cva(
  'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
  {
    variants: {
      alignIndicator: {
        start: 'pl-8 pr-2',
        end: 'pr-8 pl-2',
      },
    },
    defaultVariants: {
      alignIndicator: 'start',
    },
  },
)

type SelectItemVariantsProps = VariantProps<typeof selectItemVariants>

type SelectItemRef = ElementRef<typeof Primitive.Item>

export interface SelectItemProps
  extends ComponentPropsWithoutRef<typeof Primitive.Item>,
    SelectItemVariantsProps {}

export const SelectItem = forwardRef<SelectItemRef, SelectItemProps>(
  ({ className, alignIndicator, ...props }, ref) => {
    return (
      <Primitive.Item
        ref={ref}
        className={cn(selectItemVariants({ alignIndicator, className }))}
        {...props}
      />
    )
  },
)
SelectItem.displayName = Primitive.Item.displayName
