import { HTMLAttributes, forwardRef } from 'react'

export type NavListProps = HTMLAttributes<HTMLUListElement>

export const NavList = forwardRef<HTMLUListElement, NavListProps>(
  ({ ...props }, ref) => {
    return <ul ref={ref} {...props} />
  },
)
NavList.displayName = 'Nav.List'
