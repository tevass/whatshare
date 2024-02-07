import { cn } from '@/utils/cn'
import { HTMLAttributes, forwardRef } from 'react'

export type AsideProps = HTMLAttributes<HTMLElement>

export const Aside = forwardRef<HTMLElement, AsideProps>(
  ({ className, ...props }, ref) => {
    return (
      <aside
        ref={ref}
        className={cn('bg-shape border-r px-2 py-3', className)}
        {...props}
      />
    )
  },
)
Aside.displayName = 'Aside'
