'use client'

import * as Primitive from '@radix-ui/react-checkbox'
import { Check } from 'lucide-react'

import { cn } from '@/utils/cn'
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from 'react'
import { Except } from 'type-fest'

type CheckboxRef = ElementRef<typeof Primitive.Root>

export type CheckboxProps = Except<
  ComponentPropsWithoutRef<typeof Primitive.Root>,
  'value' | 'checked' | 'onCheckedChange' | 'onChange'
> & {
  value?: boolean
  onChange?(value?: Primitive.CheckedState): void
}

export const Checkbox = forwardRef<CheckboxRef, CheckboxProps>(
  ({ className, value, onChange, ...props }, ref) => (
    <Primitive.Root
      ref={ref}
      className={cn(
        'peer size-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
        className,
      )}
      checked={value}
      onCheckedChange={onChange}
      {...props}
    >
      <Primitive.Indicator
        className={cn('flex items-center justify-center text-current')}
      >
        <Check className="size-4" />
      </Primitive.Indicator>
    </Primitive.Root>
  ),
)
Checkbox.displayName = Primitive.Root.displayName
