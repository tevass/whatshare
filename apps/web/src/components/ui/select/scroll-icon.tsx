import { cn } from '@/utils/cn'
import { Slot, SlotProps } from '@radix-ui/react-slot'

export type SelectScrollIconProps = SlotProps

export function SelectScrollIcon({
  className,
  ...props
}: SelectScrollIconProps) {
  return <Slot className={cn('size-4', className)} {...props} />
}
