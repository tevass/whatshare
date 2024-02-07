import { HTMLAttributes, forwardRef } from 'react'

export type AsideProps = HTMLAttributes<HTMLElement>

export const Aside = forwardRef<HTMLElement, AsideProps>(
  ({ ...props }, ref) => {
    return <aside ref={ref} {...props} />
  },
)
Aside.displayName = 'Aside'
