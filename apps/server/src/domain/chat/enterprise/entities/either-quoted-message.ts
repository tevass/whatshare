import { GroupQuotedMessage } from './group-quoted-message'
import { PrivateQuotedMessage } from './private-quoted-message'

type QuotedMessage = PrivateQuotedMessage | GroupQuotedMessage

export class EitherQuotedMessage {
  readonly value: QuotedMessage

  protected constructor(value: QuotedMessage) {
    this.value = value
  }

  isPrivate(): this is EitherQuotedMessage & { value: PrivateQuotedMessage } {
    return this.value instanceof PrivateQuotedMessage
  }

  isGroup(): this is EitherQuotedMessage & { value: GroupQuotedMessage } {
    return this.value instanceof GroupQuotedMessage
  }

  static create(value: QuotedMessage) {
    return new EitherQuotedMessage(value)
  }
}
