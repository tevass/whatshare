import { Chat as Root } from './root'

import { ChatAvatar } from './avatar'
import { ChatAvatarFallback } from './avatar-fallback'
import { ChatAvatarImage } from './avatar-image'
import { ChatAvatarWrapper } from './avatar-wrapper'
import { ChatContent } from './content'
import { ChatFooter } from './footer'
import { ChatGroupIndicator } from './group-indicator'
import { ChatHeader } from './header'
import { ChatMessagesCounter } from './messages-counter'
import { ChatName } from './name'
import { ChatTime } from './time'

export const Chat = Object.assign(
  {},
  {
    Root,
    AvatarWrapper: ChatAvatarWrapper,
    Avatar: ChatAvatar,
    AvatarFallback: ChatAvatarFallback,
    AvatarImage: ChatAvatarImage,
    GroupIndicator: ChatGroupIndicator,
    Content: ChatContent,
    Header: ChatHeader,
    Footer: ChatFooter,
    Name: ChatName,
    Time: ChatTime,
    MessagesCounter: ChatMessagesCounter,
  },
)
