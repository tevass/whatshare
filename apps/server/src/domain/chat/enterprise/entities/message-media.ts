import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import type { SetOptional } from 'type-fest'
import { Media, MediaProps } from './media'
import { MimeType } from './value-objects/mime-type'

export interface MessageMediaProps extends MediaProps {
  messageId: UniqueEntityID
}

export class MessageMedia extends Media<MessageMediaProps> {
  get messageId() {
    return this.props.messageId
  }

  static create(
    props: SetOptional<MessageMediaProps, 'mimetype'>,
    id?: UniqueEntityID,
  ) {
    return new MessageMedia(
      {
        ...props,
        mimetype: props.mimetype ?? MimeType.createFromFilename(props.filename),
      },
      id,
    )
  }
}
