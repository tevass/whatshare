import { forwardRef, type HTMLAttributes } from 'react'

type NavigationItemRef = HTMLLIElement

export type NavigationItemProps = HTMLAttributes<HTMLLIElement>

export const NavigationItem = forwardRef<
  NavigationItemRef,
  NavigationItemProps
>(({ ...props }, ref) => {
  return <li ref={ref} {...props} />
})
NavigationItem.displayName = 'Navigation.Item'
