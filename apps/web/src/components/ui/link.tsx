import NextLink from 'next/link'
import { ComponentProps, forwardRef } from 'react'

export type LinkProps = ComponentProps<typeof NextLink>

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ ...props }, ref) => {
    return <NextLink {...props} ref={ref} />
  },
)
Link.displayName = 'Link'
