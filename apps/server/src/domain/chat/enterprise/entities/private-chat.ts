import type { Except, SetOptional } from 'type-fest'
import { Chat, ChatProps } from './chat'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface PrivateChatProps extends ChatProps {
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
        lastInteraction: props.lastInteraction ?? null,
        lastMessage: props.lastMessage ?? null,
        deletedAt: props.deletedAt ?? null,
        isGroup: false,
      },
      id,
    )
  }
}
