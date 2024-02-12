import { usePathname } from 'next/navigation'
import type { UrlObject } from 'url'

type Url = string | UrlObject

export interface UseIsActivePathnameProps {
  href: Url
  exactMatch?: boolean
}

export function useIsActivePathname({
  href,
  exactMatch,
}: UseIsActivePathnameProps): boolean {
  const pathname = usePathname()

  const isActive = exactMatch
    ? pathname === href.toString()
    : pathname.startsWith(href.toString())

  return isActive
}
