import { Nav } from '@/components/ui/nav'
import { MessageCircle, Phone } from 'lucide-react'
import { Navigation } from '../navigation'

export function SidebarMenu() {
  return (
    <Nav>
      <Nav.List className="space-y-2">
        <Nav.ListItem>
          <Navigation.Link href="/wa">
            <Navigation.Icon>
              <MessageCircle />
            </Navigation.Icon>
          </Navigation.Link>
        </Nav.ListItem>

        <Nav.ListItem>
          <Navigation.Link href="/contacts">
            <Navigation.Icon>
              <Phone />
            </Navigation.Icon>
          </Navigation.Link>
        </Nav.ListItem>
      </Nav.List>
    </Nav>
  )
}
