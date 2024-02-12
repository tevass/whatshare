import { cn } from '@/utils/cn'
import { HTMLAttributes, forwardRef } from 'react'

type CommandShortcutRef = HTMLSpanElement

export type CommandShortcutProps = HTMLAttributes<HTMLSpanElement>

export const CommandShortcut = forwardRef<
  CommandShortcutRef,
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
