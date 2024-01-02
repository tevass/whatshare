import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import type { SetOptional } from 'type-fest'
import { Media, MediaProps } from './media'

export interface MessageMediaProps extends MediaProps {
  messageId: UniqueEntityID | null
}

export class MessageMedia extends Media<MessageMediaProps> {
  get messageId() {
    return this.props.messageId
  }

  static create(
    props: SetOptional<MessageMediaProps, 'messageId'>,
    id?: UniqueEntityID,
  ) {
    return new MessageMedia(
      {
        ...props,
        messageId: props.messageId ?? null,
      },
      id,
    )
  }
}
