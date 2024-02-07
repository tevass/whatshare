import { Sidebar } from './components/sidebar'

type HomeLayoutProps = Readonly<{
  children: React.ReactNode
}>

export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <div className="grid h-full grid-cols-main-aside">
      <Sidebar />

      <section>{children}</section>
    </div>
  )
}
