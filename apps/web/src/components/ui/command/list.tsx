'use client'

import { Command as Primitive } from 'cmdk'
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from 'react'

import { cn } from '@/utils/cn'

type CommandListRef = ElementRef<typeof Primitive.List>

export type CommandListProps = ComponentPropsWithoutRef<typeof Primitive.List>

export const CommandList = forwardRef<CommandListRef, CommandListProps>(
  ({ className, ...props }, ref) => (
    <Primitive.List
      ref={ref}
      className={cn(
        'max-h-[300px] overflow-y-auto overflow-x-hidden',
        className,
      )}
      {...props}
    />
  ),
)
CommandList.displayName = Primitive.List.displayName
