import { HTMLAttributes, forwardRef } from 'react'

export type NavProps = HTMLAttributes<HTMLElement>

export const Nav = forwardRef<HTMLElement, NavProps>(({ ...props }, ref) => {
  return <nav ref={ref} {...props} />
})
Nav.displayName = 'Nav'
