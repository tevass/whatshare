import { cn } from '@/utils/cn'
import { Slot, SlotProps } from '@radix-ui/react-slot'

export type SidebarLinkIconProps = SlotProps

export function SidebarLinkIcon({ className, ...props }: SidebarLinkIconProps) {
  return <Slot className={cn('w-4.5 h-4.5', className)} {...props} />
}
