import { cn } from '@/utils/cn'
import { HTMLAttributes, forwardRef } from 'react'

export type HeadingH4Props = HTMLAttributes<HTMLHeadingElement>

export const HeadingH4 = forwardRef<HTMLHeadingElement, HeadingH4Props>(
  ({ className, ...props }, ref) => {
    return (
      <h4
        ref={ref}
        className={cn(
          'scroll-m-20 text-xl font-semibold tracking-tight',
          className,
        )}
        {...props}
      />
    )
  },
)
HeadingH4.displayName = 'Heading.H4'
