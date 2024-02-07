import { cn } from '@/utils/cn'
import { Command as Primitive } from 'cmdk'
import { ElementRef, ComponentPropsWithoutRef, forwardRef } from 'react'

type CommandEmptyRef = ElementRef<typeof Primitive.Empty>
export type CommandEmptyProps = ComponentPropsWithoutRef<typeof Primitive.Empty>

export const CommandEmpty = forwardRef<CommandEmptyRef, CommandEmptyProps>(
  ({ className, ...props }, ref) => (
    <Primitive.Empty
      ref={ref}
      className={cn('py-6 text-center text-sm', className)}
      {...props}
    />
  ),
)
CommandEmpty.displayName = Primitive.Empty.displayName
