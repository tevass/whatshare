'use client'

import { Command as Primitive } from 'cmdk'
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from 'react'

import { cn } from '@/utils/cn'
import { Search } from 'lucide-react'

type CommandInputRef = ElementRef<typeof Primitive.Input>

export type CommandInputProps = ComponentPropsWithoutRef<typeof Primitive.Input>

export const CommandInput = forwardRef<CommandInputRef, CommandInputProps>(
  ({ className, ...props }, ref) => (
    <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
      <Search className="mr-2 size-4 shrink-0 opacity-50" />

      <Primitive.Input
        ref={ref}
        className={cn(
          'flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      />
    </div>
  ),
)
CommandInput.displayName = Primitive.Input.displayName
