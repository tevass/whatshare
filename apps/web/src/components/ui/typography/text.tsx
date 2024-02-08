import { cn } from '@/utils/cn'
import { Slot } from '@radix-ui/react-slot'
import { HTMLAttributes, forwardRef } from 'react'

export type TextProps = HTMLAttributes<HTMLParagraphElement> & {
  asChild?: boolean
}

export const Text = forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : 'p'

    return (
      <Comp ref={ref} className={cn('leading-relaxed', className)} {...props} />
    )
  },
)
Text.displayName = 'Text'
