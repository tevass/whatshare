import { cn } from '@/utils/cn'
import { HTMLAttributes, forwardRef } from 'react'

export type HeaderProps = HTMLAttributes<HTMLElement>

export const Header = forwardRef<HTMLElement, HeaderProps>(
  ({ className, ...props }, ref) => {
    return <header className={cn(className)} ref={ref} {...props} />
  },
)
Header.displayName = 'Header'
