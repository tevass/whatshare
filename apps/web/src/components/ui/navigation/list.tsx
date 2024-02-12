import { cn } from '@/utils/cn'
import { forwardRef, type HTMLAttributes } from 'react'

type NavigationListRef = HTMLUListElement

export type NavigationListProps = HTMLAttributes<HTMLUListElement>

export const NavigationList = forwardRef<
  NavigationListRef,
  NavigationListProps
>(({ className, ...props }, ref) => {
  return <ul className={cn('space-y-1.5', className)} ref={ref} {...props} />
})
NavigationList.displayName = 'Navigation.List'
