import { ReactNode } from 'react'
import { Sidebar } from './components/sidebar'

type LayoutProps = Readonly<{
  children: ReactNode
}>

export default function Layout({ children }: LayoutProps) {
  return (
    <main className="grid grid-cols-chats h-full divide-x">
      <Sidebar />
      <section>{children}</section>
    </main>
  )
}
