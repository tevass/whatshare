import { cn } from '@/utils/cn'
import { Slot, SlotProps } from '@radix-ui/react-slot'

type NavigationLinkIconProps = SlotProps

export function NavigationIcon({
  className,
  ...props
}: NavigationLinkIconProps) {
  return <Slot className={cn('h-5 w-5', className)} {...props} />
}
