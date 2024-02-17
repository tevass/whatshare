'use client'

import * as Primitive from '@radix-ui/react-label'
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from 'react'

import { cn } from '@/utils/cn'

type LabelRef = ElementRef<typeof Primitive.Root>

export type LabelProps = ComponentPropsWithoutRef<typeof Primitive.Root>

export const Label = forwardRef<LabelRef, LabelProps>(
  ({ className, ...props }, ref) => (
    <Primitive.Root
      ref={ref}
      className={cn(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className,
      )}
      {...props}
    />
  ),
)
Label.displayName = Primitive.Root.displayName
