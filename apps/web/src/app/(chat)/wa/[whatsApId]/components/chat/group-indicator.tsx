import { cn } from '@/utils/cn'

import { forwardRef, HTMLAttributes } from 'react'

export type ChatGroupIndicatorProps = HTMLAttributes<HTMLElement>

export const ChatGroupIndicator = forwardRef<
  HTMLDivElement,
  ChatGroupIndicatorProps
>(({ className, ...props }, ref) => {
  return (
    <small
      ref={ref}
      className={cn(
        'absolute text-[10px] font-medium px-1 rounded-full -bottom-1.5 bg-primary text-primary-foreground',
        className,
      )}
      {...props}
    />
  )
})
ChatGroupIndicator.displayName = 'Chat.GroupIndicator'
