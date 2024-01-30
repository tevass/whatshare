import type { Except, SetOptional } from 'type-fest'
import { Chat, ChatProps } from './chat'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Contact } from './contact'

export interface GroupChatProps extends ChatProps {
  isGroup: true
  participants: Contact[]
}

export class GroupChat extends Chat<GroupChatProps> {
  get isGroup() {
    return this.props.isGroup
  }

  get participants() {
    return this.props.participants
  }

  static create(
    props: SetOptional<
      Except<GroupChatProps, 'isGroup'>,
      'lastInteraction' | 'lastMessage' | 'deletedAt'
    >,
    id?: UniqueEntityID,
  ) {
    return new GroupChat(
      {
        ...props,
        lastInteraction: props.lastInteraction ?? null,
        lastMessage: props.lastMessage ?? null,
        deletedAt: props.deletedAt ?? null,
        isGroup: true,
      },
      id,
    )
  }
}
