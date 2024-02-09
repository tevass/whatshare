import { cn } from '@/utils/cn'
import { VariantProps, cva } from 'class-variance-authority'
import { HTMLAttributes, forwardRef } from 'react'

const chatVariants = cva(
  'rounded-md px-4 py-3 transition-colors flex items-center space-x-3',
  {
    variants: {
      variant: {
        inactive: 'hover:bg-accent',
        active: 'bg-accent',
      },
    },
    defaultVariants: {
      variant: 'inactive',
    },
  },
)

type ChatVariantsProps = VariantProps<typeof chatVariants>
interface ChatProps extends HTMLAttributes<HTMLDivElement>, ChatVariantsProps {}

export const Chat = forwardRef<HTMLDivElement, ChatProps>(
  ({ variant, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(chatVariants({ variant, className }))}
        {...props}
      />
    )
  },
)
Chat.displayName = 'Chat'
