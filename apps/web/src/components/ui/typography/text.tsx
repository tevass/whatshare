import { cn } from '@/utils/cn'
import { HTMLAttributes, forwardRef } from 'react'

export type TextProps = HTMLAttributes<HTMLParagraphElement>

export const Text = forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, ...props }, ref) => {
    return (
      <p ref={ref} className={cn('leading-relaxed', className)} {...props} />
    )
  },
)
Text.displayName = 'Text'
