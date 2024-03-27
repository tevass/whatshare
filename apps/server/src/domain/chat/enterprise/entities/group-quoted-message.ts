import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import type { SetOptional } from 'type-fest'
import { Contact } from './contact'
import {
  CreateQuotedMessageOptionalProps,
  QuotedMessage,
  QuotedMessageProps,
} from './quoted-message'

export interface GroupQuotedMessageProps extends QuotedMessageProps {
  author: Contact
}

export class GroupQuotedMessage extends QuotedMessage<GroupQuotedMessageProps> {
  get author() {
    return this.props.author
  }

  static create(
    props: SetOptional<
      GroupQuotedMessageProps,
      keyof CreateQuotedMessageOptionalProps
    >,
    id?: UniqueEntityID,
  ) {
    return new GroupQuotedMessage({ ...props }, id)
  }
}
