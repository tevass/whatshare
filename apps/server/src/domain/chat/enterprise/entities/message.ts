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

export interface MessageProps {
  waMessageId: WAMessageID
  waChatId: WAEntityID
  whatsAppId: UniqueEntityID
  chatId: UniqueEntityID
  ack: MessageAck
  type: MessageType
  body: MessageBody | null
  media: MessageMedia | null
  contacts: Contact[] | null
  isBroadcast: boolean
  isForwarded: boolean
  isFromMe: boolean
  isStatus: boolean
  isGif: boolean
  createdAt: Date
  revokedAt: Date | null
  senderBy: AttendantProfile | null
  revokedBy: AttendantProfile | null
}

export class Message<Props extends MessageProps> extends Entity<Props> {
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

  get quoted() {
    return this.props.quoted
  }

  hasQuoted(): this is SetNonNullable<MessageProps, 'quoted'> {
    return !!this.quoted
  }

  get type() {
    return this.props.type
  }

  get body() {
    return this.props.body
  }

  hasBody(): this is SetNonNullable<MessageProps, 'body'> {
    return !!this.body
  }

  get contacts() {
    return this.props.contacts
  }

  hasContacts(): this is SetNonNullable<MessageProps, 'contacts'> {
    return !!this.contacts?.length
  }

  get media() {
    return this.props.media
  }

  hasMedia(): this is SetNonNullable<MessageProps, 'media'> {
    return !!this.media && MEDIA_TYPES.has(this.type)
  }

  get isBroadcast() {
    return this.props.isBroadcast
  }

  get isForwarded() {
    return this.props.isForwarded
  }

  get isFromMe() {
    return this.props.isFromMe
  }

  get isStatus() {
    return this.props.isStatus
  }

  get isGif() {
    return this.props.isGif
  }

  get createdAt() {
    return this.props.createdAt
  }

  get revokedAt() {
    return this.props.revokedAt
  }

  get senderBy() {
    return this.props.senderBy
  }

  hasSender(): this is SetNonNullable<MessageProps, 'senderBy'> {
    return !!this.senderBy
  }

  get revokedBy() {
    return this.props.revokedBy
  }

  hasRevoker(): this is SetNonNullable<MessageProps, 'revokedBy'> {
    return !!this.revokedBy
  }
}
