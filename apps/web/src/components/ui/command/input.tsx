import { cn } from '@/utils/cn'
import { Command as Primitive } from 'cmdk'
import { Search } from 'lucide-react'
import { ElementRef, forwardRef, ComponentPropsWithoutRef } from 'react'

type CommandInputRef = ElementRef<typeof Primitive.Input>
export type CommandInputProps = ComponentPropsWithoutRef<typeof Primitive.Input>

export const CommandInput = forwardRef<CommandInputRef, CommandInputProps>(
  ({ className, ...props }, ref) => (
    <div className="flex items-center px-3 border-b" cmdk-input-wrapper="">
      <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />

      <Primitive.Input
        ref={ref}
        className={cn(
          'flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      />
    </div>
  ),
)
CommandInput.displayName = Primitive.Input.displayName
