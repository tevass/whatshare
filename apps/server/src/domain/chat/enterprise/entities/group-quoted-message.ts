import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import type { SetNonNullable, SetOptional } from 'type-fest'
import { Contact } from './contact'
import {
  CreateQuotedMessageOptionalProps,
  QuotedMessage,
  QuotedMessageProps,
} from './quoted-message'

export interface GroupQuotedMessageProps extends QuotedMessageProps {
  author: Contact
  mentions: Contact[] | null
}

export class GroupQuotedMessage extends QuotedMessage<GroupQuotedMessageProps> {
  get author() {
    return this.props.author
  }

  get mentions() {
    return this.props.mentions
  }

  hasMentions(): this is SetNonNullable<GroupQuotedMessage, 'mentions'> {
    return !!this.mentions?.length
  }

  static create(
    props: SetOptional<
      GroupQuotedMessageProps,
      keyof CreateQuotedMessageOptionalProps | 'mentions'
    >,
    id?: UniqueEntityID,
  ) {
    return new GroupQuotedMessage(
      { ...props, mentions: props.mentions ?? null },
      id,
    )
  }
}
