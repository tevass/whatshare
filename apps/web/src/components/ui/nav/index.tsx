import { Nav as Root } from './root'
import { NavList } from './list'
import { NavListItem } from './list-item'

export const Nav = Object.assign(Root, {
  List: NavList,
  ListItem: NavListItem,
})

export type { NavProps } from './root'
export type { NavListProps } from './list'
export type { NavListItemProps } from './list-item'
