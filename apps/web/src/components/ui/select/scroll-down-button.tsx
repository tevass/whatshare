'use client'

import * as Primitive from '@radix-ui/react-select'
import { ChevronDown } from 'lucide-react'
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from 'react'

import { cn } from '@/utils/cn'

type SelectScrollDownButtonRef = ElementRef<typeof Primitive.ScrollDownButton>

export type SelectScrollDownButtonProps = ComponentPropsWithoutRef<
  typeof Primitive.ScrollDownButton
>

export const SelectScrollDownButton = forwardRef<
  SelectScrollDownButtonRef,
  SelectScrollDownButtonProps
>(({ className, ...props }, ref) => {
  return (
    <Primitive.ScrollDownButton
      ref={ref}
      className={cn(
        'flex cursor-default items-center justify-center py-1',
        className,
      )}
      {...props}
    >
      <ChevronDown className="size-4" />
    </Primitive.ScrollDownButton>
  )
})
SelectScrollDownButton.displayName = Primitive.ScrollDownButton.displayName
