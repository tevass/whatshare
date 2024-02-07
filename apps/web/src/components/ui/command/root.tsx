import { Command as Primitive } from 'cmdk'
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'
import { cn } from '@/utils/cn'

type CommandRef = ElementRef<typeof Primitive>
export type CommandProps = ComponentPropsWithoutRef<typeof Primitive>

export const Command = forwardRef<CommandRef, CommandProps>(
  ({ className, ...props }, ref) => (
    <Primitive
      ref={ref}
      className={cn(
        'flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground',
        className,
      )}
      {...props}
    />
  ),
)
Command.displayName = Primitive.displayName
