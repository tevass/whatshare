import { cn } from '@/utils/cn'
import { HTMLAttributes, forwardRef } from 'react'

export type NavListItemProps = HTMLAttributes<HTMLLIElement>

export const NavListItem = forwardRef<HTMLLIElement, NavListItemProps>(
  ({ className, ...props }, ref) => {
    return <li className={cn(className)} ref={ref} {...props} />
  },
)
NavListItem.displayName = 'Nav.List'
