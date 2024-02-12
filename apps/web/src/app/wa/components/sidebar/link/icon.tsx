import { cn } from '@/utils/cn'
import { Slot, SlotProps } from '@radix-ui/react-slot'

export type SidebarLinkIconProps = SlotProps

export function SidebarLinkIcon({ className, ...props }: SidebarLinkIconProps) {
  return <Slot className={cn('size-4.5', className)} {...props} />
}
