import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/utils/cn'

export type CommandShortcutProps = HTMLAttributes<HTMLSpanElement>

export const CommandShortcut = forwardRef(
  ({ className, ...props }: CommandShortcutProps) => {
    return (
      <span
        className={cn(
          'ml-auto text-xs tracking-widest text-muted-foreground',
          className,
        )}
        {...props}
      />
    )
  },
)
CommandShortcut.displayName = 'CommandShortcut'
