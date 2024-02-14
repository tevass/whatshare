import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef, type HtmlHTMLAttributes } from 'react'

import { cn } from '@/utils/cn'

const chatTimeVariants = cva('text-xs font-bold', {
  variants: {
    variant: {
      default: 'text-muted-foreground',
      highlight: 'text-emerald-500',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

type ChatTimeVariants = VariantProps<typeof chatTimeVariants>

type ChatTimeRef = HTMLTimeElement

export interface ChatTimeProps
  extends HtmlHTMLAttributes<HTMLTimeElement>,
    ChatTimeVariants {}

export const ChatTime = forwardRef<ChatTimeRef, ChatTimeProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <time
        ref={ref}
        className={cn(chatTimeVariants({ variant, className }))}
        {...props}
      />
    )
  },
)
ChatTime.displayName = 'Chat.Time'
