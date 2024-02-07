import { cn } from '@/utils/cn'
import { Command as Primitive } from 'cmdk'
import { ElementRef, ComponentPropsWithoutRef, forwardRef } from 'react'

type CommandGroupRef = ElementRef<typeof Primitive.Group>
export type CommandGroupProps = ComponentPropsWithoutRef<typeof Primitive.Group>

export const CommandGroup = forwardRef<CommandGroupRef, CommandGroupProps>(
  ({ className, ...props }, ref) => (
    <Primitive.Group
      ref={ref}
      className={cn(
        'overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground',
        className,
      )}
      {...props}
    />
  ),
)
CommandGroup.displayName = Primitive.Group.displayName
