import { cn } from '@/utils/cn'
import { Command as Primitive } from 'cmdk'
import { ElementRef, forwardRef, ComponentPropsWithoutRef } from 'react'

type CommandInputRef = ElementRef<typeof Primitive.Input>
export type CommandInputProps = ComponentPropsWithoutRef<typeof Primitive.Input>

export const CommandInput = forwardRef<CommandInputRef, CommandInputProps>(
  ({ className, ...props }, ref) => (
    <Primitive.Input
      ref={ref}
      className={cn(
        'flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  ),
)
CommandInput.displayName = Primitive.Input.displayName
