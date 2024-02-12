import { forwardRef, type HTMLAttributes } from 'react'

type NavigationRef = HTMLElement

export type NavigationProps = HTMLAttributes<HTMLElement>

export const Navigation = forwardRef<NavigationRef, NavigationProps>(
  ({ ...props }, ref) => {
    return <nav ref={ref} {...props} />
  },
)
Navigation.displayName = 'Navigation'
