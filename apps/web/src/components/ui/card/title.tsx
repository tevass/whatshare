import { cn } from '@/utils/cn'
import { HTMLAttributes, forwardRef } from 'react'

export type CardTitleProps = HTMLAttributes<HTMLHeadingElement>

export const CardTitle = forwardRef<HTMLParagraphElement, CardTitleProps>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        'text-2xl font-semibold leading-none tracking-tight',
        className,
      )}
      {...props}
    />
  ),
)
CardTitle.displayName = 'Card.Title'
