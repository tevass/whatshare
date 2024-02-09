import { cn } from '@/utils/cn'
import { HTMLAttributes, forwardRef } from 'react'

export type ChatAvatarWrapperProps = HTMLAttributes<HTMLDivElement>

export const ChatAvatarWrapper = forwardRef<
  HTMLDivElement,
  ChatAvatarWrapperProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('relative flex justify-center w-12 rounded-full', className)}
    {...props}
  />
))
ChatAvatarWrapper.displayName = 'Chat.AvatarWrapper'
