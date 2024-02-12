import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/utils/cn'
import { forwardRef, type HTMLAttributes } from 'react'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        primary:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
)

type BadgeVariants = VariantProps<typeof badgeVariants>

type BadgeRef = HTMLDivElement

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    BadgeVariants {}

export const Badge = forwardRef<BadgeRef, BadgeProps>(
  ({ variant, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant, className }))}
        {...props}
      />
    )
  },
)
Badge.displayName = 'Badge'
