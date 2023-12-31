import type { MessageAck, MessageType } from '@whatshare/core-schemas/entities'
import {
  Entity,
  UniqueEntityID,
  WAEntityID,
  WAMessageID,
} from '@whatshare/server-core/entities'
import type { SetNonNullable, SetOptional } from 'type-fest'
import { AttendantProfile } from './attendant-profile'
import { Contact } from './contact'
import { MessageMedia } from './message-media'

export interface MessageProps {
  waMessageId: WAMessageID
  waChatId: WAEntityID
  whatsAppId: UniqueEntityID
  chatId: UniqueEntityID

  author: Contact | null
  ack: MessageAck
  // eslint-disable-next-line no-use-before-define
  quoted: Message | null

  type: MessageType
  body: string | null
  contacts: Contact[] | null
  media: MessageMedia | null

  isBroadcast: boolean
  isForwarded: boolean
  isFromMe: boolean
  isStatus: boolean
  isGif: boolean

  createdAt: Date
  revokedAt: Date | null
  deletedAt: Date | null

  senderBy: AttendantProfile | null
  revokedBy: AttendantProfile | null
}

const MediaTypes = new Set<MessageType>([
  'image',
  'video',
  'voice',
  'document',
  'sticker',
])

interface MessageRevokeParams {
  revokedBy?: AttendantProfile | null
  revokedAt?: Date | null
}

export class Message extends Entity<MessageProps> {
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

  get author() {
    return this.props.author
  }

  hasAuthor(): this is SetNonNullable<MessageProps, 'author'> {
    return !!this.author
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
    return !!this.media && MediaTypes.has(this.type)
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

  get deletedAt() {
    return this.props.deletedAt
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

  revoke(params?: MessageRevokeParams) {
    this.set({
      revokedBy: params?.revokedBy ?? null,
      revokedAt: params?.revokedAt ?? new Date(),
      type: 'revoked',
      body: null,
      media: null,
      quoted: null,
      contacts: null,
    })
  }

  static create(
    props: SetOptional<
      MessageProps,
      | 'author'
      | 'body'
      | 'contacts'
      | 'media'
      | 'revokedAt'
      | 'deletedAt'
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
    return new Message(
      {
        ...props,
        author: props.author ?? null,
        body: props.body ?? null,
        contacts: props.contacts ?? null,
        media: props.media ?? null,
        revokedAt: props.revokedAt ?? null,
        deletedAt: props.deletedAt ?? null,
        senderBy: props.senderBy ?? null,
        revokedBy: props.revokedBy ?? null,
        ack: props.ack ?? 'pending',
        createdAt: props.createdAt ?? new Date(),
        isBroadcast: props.isBroadcast ?? false,
        isForwarded: props.isForwarded ?? false,
        isFromMe: props.isFromMe ?? true,
        isStatus: props.isStatus ?? false,
        isGif: props.isGif ?? false,
        quoted: props.quoted ?? null,
      },
      id,
    )
  }
}
