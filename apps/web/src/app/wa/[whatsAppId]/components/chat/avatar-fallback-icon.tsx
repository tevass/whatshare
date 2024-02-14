import { cn } from '@/utils/cn'
import { Slot, type SlotProps } from '@radix-ui/react-slot'

export type ChatAvatarFallbackIconProps = SlotProps

export function ChatAvatarFallbackIcon({
  className,
  ...props
}: ChatAvatarFallbackIconProps) {
  return <Slot className={cn('size-6', className)} {...props} />
}
