import { ReactNode } from 'react'
import { Sidebar } from './components/sidebar'

type AppLayoutProps = Readonly<{
  children: ReactNode
}>

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="h-full grid grid-cols-[3rem_1fr]">
      <Sidebar />

      <main className="h-full w-full">{children}</main>
    </div>
  )
}
