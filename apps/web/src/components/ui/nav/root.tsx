import { cn } from '@/utils/cn'
import { HTMLAttributes, forwardRef } from 'react'

export type NavProps = HTMLAttributes<HTMLElement>

export const Nav = forwardRef<HTMLElement, NavProps>(
  ({ className, ...props }, ref) => {
    return (
      <nav className={cn('flex flex-col', className)} ref={ref} {...props} />
    )
  },
)
Nav.displayName = 'Nav'
