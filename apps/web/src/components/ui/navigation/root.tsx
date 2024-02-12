import { NavigationItem } from './item'
import { NavigationLink } from './link'
import { NavigationList } from './list'
import { Navigation as _Navigation } from './navigation'

export const Navigation = Object.assign(
  {},
  {
    Root: _Navigation,
    List: NavigationList,
    Item: NavigationItem,
    Link: NavigationLink,
  },
)

export type { NavigationItemProps } from './item'
export type { NavigationLinkProps } from './link'
export type { NavigationListProps } from './list'
export type { NavigationProps } from './navigation'

