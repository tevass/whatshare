import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import type { Except, SetOptional } from 'type-fest'
import { Chat, ChatProps, CreateChatProps } from './chat'
import { Contact } from './contact'
import { GroupMessage } from './group-message'

export interface GroupChatProps extends ChatProps<GroupMessage> {
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
      keyof CreateChatProps
    >,
    id?: UniqueEntityID,
  ) {
    return new GroupChat(
      {
        ...props,
        isGroup: true,
      },
      id,
    )
  }
}
