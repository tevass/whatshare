import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import type { SetOptional } from 'type-fest'
import { GroupQuotedMessage } from './group-quoted-message'
import { Message, MessageProps } from './message'
import { PrivateQuotedMessage } from './private-quoted-message'

export interface PrivateMessageProps
  extends MessageProps<PrivateQuotedMessage | GroupQuotedMessage> {
  isBroadcast: boolean
  isStatus: boolean
}

export class PrivateMessage extends Message<PrivateMessageProps> {
  get isBroadcast() {
    return this.props.isBroadcast
  }

  get isStatus() {
    return this.props.isStatus
  }

  static create(
    props: SetOptional<
      PrivateMessageProps,
      | 'body'
      | 'contacts'
      | 'media'
      | 'revokedAt'
      | 'senderBy'
      | 'revokedBy'
      | 'ack'
      | 'createdAt'
      | 'isBroadcast'
      | 'isForwarded'
      | 'isFromMe'
      | 'isStatus'
      | 'isGif'
      | 'quoted'
    >,
    id?: UniqueEntityID,
  ) {
    return new PrivateMessage(
      {
        ...props,
        isBroadcast: props.isBroadcast ?? false,
        isStatus: props.isStatus ?? false,
      },
      id,
    )
  }
}
