import { cn } from '@/utils/cn'
import { HTMLAttributes, forwardRef } from 'react'

export type AsideProps = HTMLAttributes<HTMLElement>

export const Aside = forwardRef<HTMLElement, AsideProps>(
  ({ className, ...props }, ref) => {
    return <aside className={cn(className)} ref={ref} {...props} />
  },
)
Aside.displayName = 'Aside'
