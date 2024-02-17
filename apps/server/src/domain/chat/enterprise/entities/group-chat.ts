import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import type { Except, SetOptional } from 'type-fest'
import { Chat, ChatProps, CreateChatOptionalProps } from './chat'
import { GroupChatContactList } from './grou-chat-contact-list'
import { GroupMessage } from './group-message'

export interface GroupChatProps extends ChatProps<GroupMessage> {
  isGroup: true
  participants: GroupChatContactList
}

export class GroupChat extends Chat<GroupChatProps> {
  get isGroup() {
    return this.props.isGroup
  }

  get participants() {
    return this.props.participants
  }

  interact(message: GroupMessage): void {
    super.interact(message)
  }

  static create(
    props: SetOptional<
      Except<GroupChatProps, 'isGroup'>,
      keyof CreateChatOptionalProps | 'participants'
    >,
    id?: UniqueEntityID,
  ) {
    return new GroupChat(
      {
        ...props,
        isGroup: true,
        participants: props.participants ?? GroupChatContactList.create([]),
      },
      id,
    )
  }
}
