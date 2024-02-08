import { HTMLAttributes, forwardRef } from 'react'

export type NavListItemProps = HTMLAttributes<HTMLLIElement>

export const NavListItem = forwardRef<HTMLLIElement, NavListItemProps>(
  ({ ...props }, ref) => {
    return <li ref={ref} {...props} />
  },
)
NavListItem.displayName = 'Nav.ListItem'
