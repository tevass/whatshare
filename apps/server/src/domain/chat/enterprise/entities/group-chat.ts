import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import type { SetOptional } from 'type-fest'
import { Chat, ChatProps, CreateChatOptionalProps } from './chat'
import { Group } from './group'
import { GroupMessage } from './group-message'

export interface GroupChatProps extends ChatProps<GroupMessage> {
  group: Group
}

export class GroupChat extends Chat<GroupChatProps> {
  get group() {
    return this.props.group
  }

  static create(
    props: SetOptional<GroupChatProps, keyof CreateChatOptionalProps>,
    id?: UniqueEntityID,
  ) {
    return new GroupChat({ ...props }, id)
  }
}
