import { ReactNode } from 'react'
import { Sidebar } from './components/sidebar'

type ChatsLayoutProps = Readonly<{
  children: ReactNode
}>

export default function ChatsLayout({ children }: ChatsLayoutProps) {
  return (
    <div className="h-full w-full grid grid-cols-[25%_75%]">
      <Sidebar />
      <section>{children}</section>
    </div>
  )
}
