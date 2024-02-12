import { forwardRef, type HTMLAttributes } from 'react'

type AsideRef = HTMLElement

export type AsideProps = HTMLAttributes<HTMLElement>

export const Aside = forwardRef<AsideRef, AsideProps>(({ ...props }, ref) => {
  return <aside ref={ref} {...props} />
})
Aside.displayName = 'Aside'
