'use client'

import * as Primitive from '@radix-ui/react-select'
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from 'react'

import { cn } from '@/utils/cn'
import { Check } from 'lucide-react'

type SelectItemRef = ElementRef<typeof Primitive.Item>

export type SelectItemProps = ComponentPropsWithoutRef<typeof Primitive.Item>

export const SelectItem = forwardRef<SelectItemRef, SelectItemProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Primitive.Item
        ref={ref}
        className={cn(
          'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
          className,
        )}
        {...props}
      >
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          <Primitive.ItemIndicator>
            <Check className="size-4" />
          </Primitive.ItemIndicator>
        </span>

        <Primitive.ItemText>{children}</Primitive.ItemText>
      </Primitive.Item>
    )
  },
)
SelectItem.displayName = Primitive.Item.displayName
