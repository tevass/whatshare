import type { OverrideProperties } from 'type-fest'
import { GroupMessage } from '../entities/group-message'
import { PrivateMessage } from '../entities/private-message'

type Message = PrivateMessage | GroupMessage

export class EitherMessage {
  readonly value: Message

  protected constructor(value: Message) {
    this.value = value
  }

  isPrivate(): this is OverrideProperties<
    EitherMessage,
    { value: PrivateMessage }
  > {
    return this.value instanceof PrivateMessage
  }

  isGroup(): this is OverrideProperties<
    EitherMessage,
    { value: GroupMessage }
  > {
    return this.value instanceof GroupMessage
  }

  static create(value: Message) {
    return new EitherMessage(value)
  }
}
