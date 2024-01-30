import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import type { SetNonNullable, SetOptional } from 'type-fest'
import { AttendantProfile } from './attendant-profile'
import { Contact } from './contact'
import { GroupQuotedMessage } from './group-quoted-message'
import { Message, MessageProps } from './message'

export interface GroupMessageProps extends MessageProps<GroupQuotedMessage> {
  author: Contact
  mentions: Contact[] | null
}

export class GroupMessage extends Message<GroupMessageProps> {
  get author() {
    return this.props.author
  }

  get mentions() {
    return this.props.mentions
  }

  hasMentions(): this is SetNonNullable<GroupMessageProps, 'mentions'> {
    return !!this.mentions?.length
  }

  revoke(by?: AttendantProfile | null) {
    super.revoke(by)
    this.set({ mentions: null })
  }

  static create(
    props: SetOptional<
      GroupMessageProps,
      | 'body'
      | 'contacts'
      | 'media'
      | 'revokedAt'
      | 'senderBy'
      | 'revokedBy'
      | 'ack'
      | 'createdAt'
      | 'isForwarded'
      | 'isFromMe'
      | 'isGif'
      | 'quoted'
      | 'mentions'
    >,
    id?: UniqueEntityID,
  ) {
    return new GroupMessage(
      {
        ...props,
        mentions: props.mentions ?? null,
      },
      id,
    )
  }
}
