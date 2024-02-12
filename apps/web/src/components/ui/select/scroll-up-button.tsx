'use client'

import * as Primitive from '@radix-ui/react-select'
import { ChevronUp } from 'lucide-react'
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from 'react'

import { cn } from '@/utils/cn'

type SelectScrollUpButtonRef = ElementRef<typeof Primitive.ScrollUpButton>

export type SelectScrollUpButtonProps = ComponentPropsWithoutRef<
  typeof Primitive.ScrollUpButton
>

export const SelectScrollUpButton = forwardRef<
  SelectScrollUpButtonRef,
  SelectScrollUpButtonProps
>(({ className, ...props }, ref) => {
  return (
    <Primitive.ScrollUpButton
      ref={ref}
      className={cn(
        'flex cursor-default items-center justify-center py-1',
        className,
      )}
      {...props}
    >
      <ChevronUp className="size-4" />
    </Primitive.ScrollUpButton>
  )
})
SelectScrollUpButton.displayName = Primitive.ScrollUpButton.displayName
