import { IconButton } from '@/components/ui/icon-button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

type HomeLayoutProps = Readonly<{
  children: React.ReactNode
}>

export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <div className="grid h-full grid-cols-main-aside">
      <aside className="flex flex-col items-center py-3 space-y-2.5 border-r bg-shape">
        <div className="flex flex-col items-center space-y-2">
          <Link
            href="/"
            className="flex items-center justify-center -translate-x-px border rounded-sm text-gg w-9 h-9 bg-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <h4 className="font-medium">NT</h4>
          </Link>
        </div>

        <IconButton size="xs" variant="secondary">
          <Plus className="w-3.5 h-3.5" />
        </IconButton>
      </aside>

      <section>{children}</section>
    </div>
  )
}
