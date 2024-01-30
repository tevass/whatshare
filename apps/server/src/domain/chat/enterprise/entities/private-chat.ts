import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import type { Except, SetOptional } from 'type-fest'
import { Chat, ChatProps } from './chat'
import { PrivateMessage } from './private-message'

export interface PrivateChatProps extends ChatProps<PrivateMessage> {
  isGroup: false
}

export class PrivateChat extends Chat<PrivateChatProps> {
  get isGroup() {
    return this.props.isGroup
  }

  static create(
    props: SetOptional<
      Except<PrivateChatProps, 'isGroup'>,
      'lastInteraction' | 'lastMessage' | 'deletedAt'
    >,
    id?: UniqueEntityID,
  ) {
    return new PrivateChat(
      {
        ...props,
        isGroup: false,
      },
      id,
    )
  }
}
