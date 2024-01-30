import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WAEntityID } from '@/core/entities/wa-entity-id'
import { WAMessageID } from '@/core/entities/wa-message-id'
import { MessageType } from '@whatshare/core-schemas/enums'
import type { SetNonNullable, SetOptional } from 'type-fest'
import { MESSAGE_MEDIA_TYPES } from '../constants/media-types'
import { AttendantProfile } from './attendant-profile'
import { MessageMedia } from './message-media'
import { MessageBody } from './value-objects/message-body'

export interface QuotedMessageProps {
  waMessageId: WAMessageID
  waChatId: WAEntityID
  whatsAppId: UniqueEntityID
  chatId: UniqueEntityID
  type: MessageType
  body: MessageBody | null
  media: MessageMedia | null
  isFromMe: boolean
  senderBy: AttendantProfile | null
}

export class QuotedMessage<
  Props extends QuotedMessageProps = QuotedMessageProps,
> extends Entity<Props> {
  protected constructor(
    props: SetOptional<Props, 'body' | 'media' | 'senderBy' | 'isFromMe'>,
    id?: UniqueEntityID,
  ) {
    super(
      {
        ...props,
        isFromMe: props.isFromMe || true,
      } as Props,
      id,
    )

    this.media?.set({ messageId: id })
  }

  get waMessageId() {
    return this.props.waMessageId
  }

  get waChatId() {
    return this.props.waChatId
  }

  get whatsAppId() {
    return this.props.whatsAppId
  }

  get chatId() {
    return this.props.chatId
  }

  get type() {
    return this.props.type
  }

  get body() {
    return this.props.body
  }

  hasBody(): this is SetNonNullable<QuotedMessageProps, 'body'> {
    return !!this.body
  }

  get media() {
    return this.props.media
  }

  hasMedia(): this is SetNonNullable<QuotedMessageProps, 'media'> {
    return !!this.media && MESSAGE_MEDIA_TYPES.has(this.type)
  }

  get isFromMe() {
    return this.props.isFromMe
  }

  get senderBy() {
    return this.props.senderBy
  }

  hasSender(): this is SetNonNullable<QuotedMessageProps, 'senderBy'> {
    return !!this.senderBy
  }
}
