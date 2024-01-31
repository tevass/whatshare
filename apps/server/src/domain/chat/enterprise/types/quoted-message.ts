import { GroupQuotedMessage } from '../entities/group-quoted-message'
import { PrivateQuotedMessage } from '../entities/private-quoted-message'

export type QuotedMessage = PrivateQuotedMessage | GroupQuotedMessage

export function isPrivateQuotedMessage(
  message: QuotedMessage,
): message is PrivateQuotedMessage {
  return message instanceof PrivateQuotedMessage
}

export function isGroupQuotedMessage(
  message: QuotedMessage,
): message is GroupQuotedMessage {
  return message instanceof GroupQuotedMessage
}
