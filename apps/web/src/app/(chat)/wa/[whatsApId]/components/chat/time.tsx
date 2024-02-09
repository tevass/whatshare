import { cn } from '@/utils/cn'
import { VariantProps, cva } from 'class-variance-authority'
import { HtmlHTMLAttributes, forwardRef } from 'react'

const chatTimeVariants = cva('text-xs font-bold', {
  variants: {
    variant: {
      default: 'text-muted-foreground',
      highlight: 'text-mountain-meadow-600',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

type ChatTimeVariants = VariantProps<typeof chatTimeVariants>

interface ChatTimeProps
  extends HtmlHTMLAttributes<HTMLTimeElement>,
    ChatTimeVariants {}

export const ChatTime = forwardRef<HTMLTimeElement, ChatTimeProps>(
  ({ variant, className, ...props }, ref) => {
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
