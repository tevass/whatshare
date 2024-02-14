import { forwardRef, type HTMLAttributes } from 'react'

type HeaderRef = HTMLElement

export type HeaderProps = HTMLAttributes<HTMLElement>

export const Header = forwardRef<HeaderRef, HeaderProps>(
  ({ ...props }, ref) => {
    return <header ref={ref} {...props} />
  },
)
Header.displayName = 'Header'
