import { Aside } from '@/components/ui/aside'
import { Navigation } from './navigation'

export function Sidebar() {
  return (
    <Aside className="flex flex-col items-center">
      <Navigation />
    </Aside>
  )
}
