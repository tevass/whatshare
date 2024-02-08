'use client'

import { IconButton } from '@/components/ui/icon-button'
import { Link, LinkProps } from '@/components/ui/link'
import {
  UseIsActiveLinkProps,
  useIsActiveLink,
} from '@/hooks/use-is-active-link'

interface NavigationLinkProps extends LinkProps, UseIsActiveLinkProps {}

export function NavigationLink({ exactMatch, ...props }: NavigationLinkProps) {
  const isActive = useIsActiveLink({ href: props.href, exactMatch })

  return (
    <IconButton
      asChild
      variant={isActive ? 'primary' : 'ghost'}
      size="sm"
      className="rounded-lg"
    >
      <Link {...props} />
    </IconButton>
  )
}
