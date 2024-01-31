import { GroupChat } from './group-chat'
import { PrivateChat } from './private-chat'

type Chat = PrivateChat | GroupChat

export class EitherChat {
  readonly value: Chat

  protected constructor(value: Chat) {
    this.value = value
  }

  isPrivate(): this is EitherChat & { value: PrivateChat } {
    return this.value instanceof PrivateChat
  }

  isGroup(): this is EitherChat & { value: GroupChat } {
    return this.value instanceof GroupChat
  }

  static create(value: Chat) {
    return new EitherChat(value)
  }
}
