import { Slot } from '@radix-ui/react-slot'
import NextLink from 'next/link'
import { forwardRef, type ComponentProps } from 'react'

type LinkRef = HTMLAnchorElement

export type LinkProps = ComponentProps<typeof NextLink> & {
  asChild?: boolean
}

export const Link = forwardRef<LinkRef, LinkProps>(
  ({ asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : NextLink

    return <Comp {...props} ref={ref} />
  },
)
Link.displayName = 'Link'
