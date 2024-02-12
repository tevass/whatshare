import { cn } from '@/utils/cn'
import { forwardRef, type HTMLAttributes } from 'react'

type SidebarContentRef = HTMLDivElement

export type SidebarContentProps = HTMLAttributes<HTMLDivElement>

export const SidebarContent = forwardRef<
  SidebarContentRef,
  SidebarContentProps
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'flex h-full flex-col items-center justify-between p-2',
        className,
      )}
      {...props}
    />
  )
})
SidebarContent.displayName = 'SidebarContent'
