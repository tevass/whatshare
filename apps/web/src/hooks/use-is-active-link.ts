'use client'

import { usePathname } from 'next/navigation'
import type { UrlObject } from 'url'

type Url = string | UrlObject

export interface UseIsActiveLinkProps {
  href: Url
  exactMatch?: boolean
}

export function useIsActiveLink({
  href,
  exactMatch,
}: UseIsActiveLinkProps): boolean {
  const pathname = usePathname()

  const isActive = exactMatch
    ? pathname === href.toString()
    : pathname.startsWith(href.toString())

  return isActive
}
