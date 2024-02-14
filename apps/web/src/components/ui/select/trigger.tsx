'use client'

import * as Primitive from '@radix-ui/react-select'
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from 'react'

import { cn } from '@/utils/cn'
import { ChevronDown } from 'lucide-react'

type SelectTriggerRef = ElementRef<typeof Primitive.Trigger>

export type SelectTriggerProps = ComponentPropsWithoutRef<
  typeof Primitive.Trigger
>

export const SelectTrigger = forwardRef<SelectTriggerRef, SelectTriggerProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Primitive.Trigger
        ref={ref}
        className={cn(
          'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
          className,
        )}
        {...props}
      >
        {children}

        <Primitive.Icon asChild>
          <ChevronDown className="size-4 opacity-50" />
        </Primitive.Icon>
      </Primitive.Trigger>
    )
  },
)
SelectTrigger.displayName = Primitive.Trigger.displayName
