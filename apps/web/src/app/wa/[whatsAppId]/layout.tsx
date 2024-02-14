import type { PropsWithChildren } from 'react'
import { Sidebar } from './components/sidebar'

type LayoutProps = Readonly<PropsWithChildren>

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="grid h-full divide-x grid-cols-chat">
      <Sidebar />
      <section>{children}</section>
    </div>
  )
}
