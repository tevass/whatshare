import { cn } from '@/utils/cn'
import { Slot, SlotProps } from '@radix-ui/react-slot'

export type SelectItemIndicatorIconProps = SlotProps

export function SelectItemIndicatorIcon({
  className,
  ...props
}: SelectItemIndicatorIconProps) {
  return <Slot className={cn('size-4', className)} {...props} />
}
