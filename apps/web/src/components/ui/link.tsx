import { cn } from '@/utils/cn'
import { Slot } from '@radix-ui/react-slot'
import NextLink from 'next/link'
import { forwardRef, type ComponentProps } from 'react'

type LinkRef = HTMLAnchorElement

export type LinkProps = ComponentProps<typeof NextLink> & {
  asChild?: boolean
}

export const Link = forwardRef<LinkRef, LinkProps>(
  ({ asChild = false, className, ...props }, ref) => {
    const Comp = asChild ? Slot : NextLink

    return (
      <Comp
        ref={ref}
        className={cn(
          'ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          className,
        )}
        {...props}
      />
    )
  },
)
Link.displayName = 'Link'
