import { Aside } from '@/components/ui/aside'
import { SidebarMenu } from './menu'
import { SidebarUser } from './user'

export function Sidebar() {
  return (
    <Aside className="border-r">
      <div className="h-full flex flex-col justify-between py-2 px-1 items-center">
        <SidebarMenu />

        <SidebarUser />
      </div>
    </Aside>
  )
}
