import { Aside } from '@/components/ui/aside'
import { Navigation } from '@/components/ui/navigation'
import { MessageCircle, Users } from 'lucide-react'

import { Avatar } from '@/components/ui/avatar'
import { SidebarContent } from './content'
import { SidebarLink } from './link'

export function Sidebar() {
  return (
    <Aside className="bg-muted">
      <SidebarContent>
        <Navigation.Root>
          <Navigation.List>
            <SidebarLink.Root href="/wa">
              <SidebarLink.Icon>
                <MessageCircle />
              </SidebarLink.Icon>
            </SidebarLink.Root>

            <SidebarLink.Root href="/contacts">
              <SidebarLink.Icon>
                <Users />
              </SidebarLink.Icon>
            </SidebarLink.Root>
          </Navigation.List>
        </Navigation.Root>

        <Avatar.Root size="sm">
          <Avatar.Image src="https://github.com/tevass.png" />
          <Avatar.Fallback size="sm" className="bg-foreground/10">
            ES
          </Avatar.Fallback>
        </Avatar.Root>
      </SidebarContent>
    </Aside>
  )
}
