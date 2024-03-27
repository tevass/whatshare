import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import type { SetOptional } from 'type-fest'
import { Chat, ChatProps, CreateChatOptionalProps } from './chat'
import { Contact } from './contact'
import { PrivateMessage } from './private-message'

export interface PrivateChatProps extends ChatProps<PrivateMessage> {
  contact: Contact
}

export class PrivateChat extends Chat<PrivateChatProps> {
  get contact() {
    return this.props.contact
  }

  static create(
    props: SetOptional<PrivateChatProps, keyof CreateChatOptionalProps>,
    id?: UniqueEntityID,
  ) {
    return new PrivateChat({ ...props }, id)
  }
}
