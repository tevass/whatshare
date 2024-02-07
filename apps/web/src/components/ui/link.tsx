import { cn } from '@/utils/cn'
import NextLink from 'next/link'
import { ComponentProps, forwardRef } from 'react'

export type LinkProps = ComponentProps<typeof NextLink>

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, ...props }, ref) => {
    return (
      <NextLink
        ref={ref}
        className={cn(
          'focus-within:outline-none focus-within:ring-1 focus-within:ring-ring',
          className,
        )}
        {...props}
      />
    )
  },
)
Link.displayName = 'Link'
