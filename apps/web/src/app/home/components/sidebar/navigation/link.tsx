'use client'

import { Badge } from '@/components/ui/badge'
import { Link, LinkProps } from '@/components/ui/link'
import {
  UseIsActiveLinkProps,
  useIsActiveLink,
} from '@/hooks/use-is-active-link'
import { cn } from '@/utils/cn'

type NavigationLinkProps = LinkProps & UseIsActiveLinkProps

export function NavigationLink({
  children,
  exactMatch,
  className,
  ...props
}: NavigationLinkProps) {
  const isActive = useIsActiveLink({ href: props.href, exactMatch })

  return (
    <Link {...props} className="group focus-within:outline-none" passHref>
      <Badge
        variant={isActive ? 'primary' : 'outline'}
        className={cn(
          'rounded-sm h-8 w-9 justify-center group-focus-within:ring-1 group-focus-within:ring-ring text-sm',
          className,
        )}
      >
        {children}
      </Badge>
    </Link>
  )
}
