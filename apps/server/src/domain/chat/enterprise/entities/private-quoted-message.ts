import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import type { SetOptional } from 'type-fest'
import { QuotedMessage, QuotedMessageProps } from './quoted-message'

export interface PrivateQuotedMessageProps extends QuotedMessageProps {
  isStatus: boolean
}

export class PrivateQuotedMessage extends QuotedMessage<PrivateQuotedMessageProps> {
  get isStatus() {
    return this.props.isStatus
  }

  static create(
    props: SetOptional<
      PrivateQuotedMessageProps,
      'body' | 'media' | 'senderBy' | 'isFromMe' | 'isStatus'
    >,
    id?: UniqueEntityID,
  ) {
    return new PrivateQuotedMessage(
      {
        ...props,
        isStatus: props.isStatus ?? false,
      },
      id,
    )
  }
}
