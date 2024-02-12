import type { PropsWithChildren } from 'react'

type LayoutProps = Readonly<PropsWithChildren>

export default function Layout({ children }: LayoutProps) {
  return (
    <section className="grid h-full">
      {/* <Sidebar /> */}
      <main>{children}</main>
    </section>
  )
}
