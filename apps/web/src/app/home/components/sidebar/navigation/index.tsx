import { IconButton } from '@/components/ui/icon-button'
import { Nav } from '@/components/ui/nav'
import { Plus } from 'lucide-react'
import { NavigationLink } from './link'

export function Navigation() {
  return (
    <Nav className="items-center space-y-2">
      <Nav.List className="items-center space-y-2">
        <Nav.ListItem>
          <NavigationLink href="/">NT</NavigationLink>
        </Nav.ListItem>

        <Nav.ListItem>
          <NavigationLink href="/teste">LJ</NavigationLink>
        </Nav.ListItem>
      </Nav.List>

      <IconButton
        size="xs"
        variant="transparent"
        className="border border-dashed text-muted-foreground"
      >
        <Plus className="w-4 h-4" />
      </IconButton>
    </Nav>
  )
}
