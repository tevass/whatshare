import { cn } from '@/utils/cn'
import { HTMLAttributes, forwardRef } from 'react'

export type NavListProps = HTMLAttributes<HTMLUListElement>

export const NavList = forwardRef<HTMLUListElement, NavListProps>(
  ({ className, ...props }, ref) => {
    return (
      <ul className={cn('flex flex-col', className)} ref={ref} {...props} />
    )
  },
)
NavList.displayName = 'Nav.List'
