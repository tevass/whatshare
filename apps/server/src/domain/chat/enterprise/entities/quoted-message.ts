import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WAEntityID } from '@/core/entities/wa-entity-id'
import { WAMessageID } from '@/core/entities/wa-message-id'
import { MessageAck, MessageType } from '@whatshare/core-schemas/enums'
import { MessageBody } from './value-objects/message-body'
import { MessageMedia } from './message-media'
import { Contact } from './contact'
import { AttendantProfile } from './attendant-profile'
import { SetNonNullable } from 'type-fest'
import { MESSAGE_MEDIA_TYPES } from '../constants/media-types'

export interface QuotedMessageProps {
  waMessageId: WAMessageID
  waChatId: WAEntityID
  whatsAppId: UniqueEntityID
  chatId: UniqueEntityID
  ack: MessageAck
  type: MessageType
  body: MessageBody | null
  media: MessageMedia | null
  contacts: Contact[] | null
  isStatus: boolean
  senderBy: AttendantProfile | null
}

export class QuotedMessage<
  Props extends QuotedMessageProps,
> extends Entity<Props> {
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

  get ack() {
    return this.props.ack
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

  get isStatus() {
    return this.props.isStatus
  }

  get senderBy() {
    return this.props.senderBy
  }

  hasSender(): this is SetNonNullable<QuotedMessageProps, 'senderBy'> {
    return !!this.senderBy
  }
}
