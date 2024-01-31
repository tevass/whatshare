import { GroupMessage } from '../entities/group-message'
import { PrivateMessage } from '../entities/private-message'

export type Message = PrivateMessage | GroupMessage

export function isPrivateMessage(message: Message): message is PrivateMessage {
  return message instanceof PrivateMessage
}

export function isGroupMessage(message: Message): message is GroupMessage {
  return message instanceof GroupMessage
}
