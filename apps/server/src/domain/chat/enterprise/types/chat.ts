import { GroupChat } from '../entities/group-chat'
import { PrivateChat } from '../entities/private-chat'

export type Chat = PrivateChat | GroupChat

export function isPrivateChat(chat: Chat): chat is PrivateChat {
  return chat instanceof PrivateChat
}

export function isGroupChat(chat: Chat): chat is GroupChat {
  return chat instanceof GroupChat
}
