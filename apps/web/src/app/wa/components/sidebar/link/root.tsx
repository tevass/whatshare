import { SidebarLinkIcon } from './icon'
import { SidebarLink as _SidebarLink } from './link'

export const SidebarLink = Object.assign(
  {},
  {
    Root: _SidebarLink,
    Icon: SidebarLinkIcon,
  },
)

export type { SidebarLinkIconProps } from './icon'
export type { SidebarLinkProps } from './link'

