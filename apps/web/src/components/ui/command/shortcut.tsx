import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/utils/cn'

export type CommandShortcutProps = HTMLAttributes<HTMLSpanElement>

export const CommandShortcut = forwardRef<
  HTMLSpanElement,
  CommandShortcutProps
>(({ className, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn(
        'ml-auto text-xs tracking-widest text-muted-foreground',
        className,
      )}
      {...props}
    />
  )
})
CommandShortcut.displayName = 'CommandShortcut'
