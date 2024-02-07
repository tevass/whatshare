import { cn } from '@/utils/cn'
import { HTMLAttributes, forwardRef } from 'react'

export type HeadingH2Props = HTMLAttributes<HTMLHeadingElement>

export const HeadingH2 = forwardRef<HTMLHeadingElement, HeadingH2Props>(
  ({ className, ...props }, ref) => {
    return (
      <h2
        ref={ref}
        className={cn(
          'scroll-m-20 text-3xl font-semibold tracking-tight',
          className,
        )}
        {...props}
      />
    )
  },
)
HeadingH2.displayName = 'Heading.H2'
