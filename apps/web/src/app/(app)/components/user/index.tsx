import { Nav } from '@/components/ui/nav'
import { Navigation } from '../navigation'
import { Settings } from 'lucide-react'
import { Avatar } from '@/components/ui/avatar'

export function SidebarUser() {
  return (
    <section className="space-y-2 flex flex-col items-center">
      <Nav>
        <Nav.List>
          <Nav.ListItem>
            <Navigation.Link href="/settings">
              <Navigation.Icon>
                <Settings />
              </Navigation.Icon>
            </Navigation.Link>
          </Nav.ListItem>
        </Nav.List>
      </Nav>

      <Avatar size="sm">
        <Avatar.Image src="https://github.com/tevass.png" />
      </Avatar>
    </section>
  )
}
