import { forwardRef, type HTMLAttributes } from 'react'

type FooterRef = HTMLElement

export type FooterProps = HTMLAttributes<HTMLElement>

export const Footer = forwardRef<FooterRef, FooterProps>(
  ({ ...props }, ref) => {
    return <footer ref={ref} {...props} />
  },
)
Footer.displayName = 'Footer'
