import { cn } from '@/utils/cn'
import { HTMLAttributes, forwardRef } from 'react'

export type HeadingH3Props = HTMLAttributes<HTMLHeadingElement>

export const HeadingH3 = forwardRef<HTMLHeadingElement, HeadingH3Props>(
  ({ className, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn(
          'scroll-m-20 text-2xl font-semibold tracking-tight',
          className,
        )}
        {...props}
      />
    )
  },
)
HeadingH3.displayName = 'Heading.H3'
