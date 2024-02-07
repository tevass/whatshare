import { cn } from '@/utils/cn'
import { Command as Primitive } from 'cmdk'
import { ElementRef, ComponentPropsWithoutRef, forwardRef } from 'react'

type CommandItemRef = ElementRef<typeof Primitive.Item>
export type CommandItemProps = ComponentPropsWithoutRef<typeof Primitive.Item>

export const CommandItem = forwardRef<CommandItemRef, CommandItemProps>(
  ({ className, ...props }, ref) => (
    <Primitive.Item
      ref={ref}
      className={cn(
        'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className,
      )}
      {...props}
    />
  ),
)
CommandItem.displayName = Primitive.Item.displayName
