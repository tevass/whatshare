'use client'

import { Command as Primitive } from 'cmdk'
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from 'react'

import { cn } from '@/utils/cn'

type CommandSeparatorRef = ElementRef<typeof Primitive.Separator>

export type CommandSeparatorProps = ComponentPropsWithoutRef<
  typeof Primitive.Separator
>

export const CommandSeparator = forwardRef<
  CommandSeparatorRef,
  CommandSeparatorProps
>(({ className, ...props }, ref) => (
  <Primitive.Separator
    ref={ref}
    className={cn('-mx-1 h-px bg-border', className)}
    {...props}
  />
))
CommandSeparator.displayName = Primitive.Separator.displayName
