import { cn } from '@/utils/cn'
import { HTMLAttributes, forwardRef } from 'react'

export type HeadingH1Props = HTMLAttributes<HTMLHeadingElement>

export const HeadingH1 = forwardRef<HTMLHeadingElement, HeadingH1Props>(
  ({ className, ...props }, ref) => {
    return (
      <h1
        ref={ref}
        className={cn(
          'scroll-m-20 text-4xl font-extrabold tracking-tight',
          className,
        )}
        {...props}
      />
    )
  },
)
HeadingH1.displayName = 'Heading.H1'
