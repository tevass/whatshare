import { Aside } from '@/components/ui/aside'
import { Button } from '@/components/ui/button'
import { SquarePen } from 'lucide-react'
import type { PropsWithChildren } from 'react'

type LayoutProps = Readonly<PropsWithChildren>

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="grid grid-cols-chat h-full divide-x">
      <Aside>
        <header className="px-6 py-4">
          <div className="flex items-center justify-between">
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
              Conversas
            </h4>

            <Button variant="ghost" size="icon">
              <SquarePen className="h-4.5 w-4.5" />
            </Button>
          </div>
        </header>
      </Aside>

      <section>{children}</section>
    </div>
  )
}
