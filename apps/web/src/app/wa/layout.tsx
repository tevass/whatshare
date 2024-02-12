import type { PropsWithChildren } from 'react'
import { Sidebar } from './components/sidebar'

type LayoutProps = Readonly<PropsWithChildren>

export default function Layout({ children }: LayoutProps) {
  return (
    <section className="grid h-full grid-cols-sidebar">
      <Sidebar />
      <main>{children}</main>
    </section>
  )
}
