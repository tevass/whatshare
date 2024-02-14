import { ChatAvatar } from './avatar'
import { ChatAvatarFallback } from './avatar-fallback'
import { ChatAvatarFallbackIcon } from './avatar-fallback-icon'
import { ChatAvatarImage } from './avatar-image'
import { Chat as _Chat } from './chat'
import { ChatContent } from './content'
import { ChatFooter } from './footer'
import { ChatHeader } from './header'
import { ChatMessagesCounter } from './messages-counter'
import { ChatName } from './name'
import { ChatTime } from './time'

export const Chat = Object.assign(
  {},
  {
    Root: _Chat,
    Avatar: ChatAvatar,
    AvatarFallback: ChatAvatarFallback,
    AvatarFallbackIcon: ChatAvatarFallbackIcon,
    AvatarImage: ChatAvatarImage,
    Content: ChatContent,
    Header: ChatHeader,
    Footer: ChatFooter,
    Name: ChatName,
    Time: ChatTime,
    MessagesCounter: ChatMessagesCounter,
  },
)

export type { ChatAvatarProps } from './avatar'
export type { ChatAvatarFallbackProps } from './avatar-fallback'
export type { ChatAvatarFallbackIconProps } from './avatar-fallback-icon'
export type { ChatAvatarImageProps } from './avatar-image'
export type { ChatProps } from './chat'
export type { ChatContentProps } from './content'
export type { ChatFooterProps } from './footer'
export type { ChatHeaderProps } from './header'
export type { ChatMessagesCounterProps } from './messages-counter'
export type { ChatNameProps } from './name'
export type { ChatTimeProps } from './time'

