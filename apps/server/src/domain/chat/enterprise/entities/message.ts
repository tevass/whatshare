import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WAEntityID } from '@/core/entities/wa-entity-id'
import { WAMessageID } from '@/core/entities/wa-message-id'
import { MessageAck, MessageType } from '@whatshare/core'
import type { SetNonNullable, SetOptional } from 'type-fest'
import { MESSAGE_MEDIA_TYPES } from '../constants/media-types'
import { Contact } from './contact'
import { MessageMedia } from './message-media'
import { MessageBody } from './value-objects/message-body'
import { AttendantProfile } from './value-objects/attendant-profile'

export interface MessageProps<Quoted = null> {
  waMessageId: WAMessageID
  waChatId: WAEntityID
  whatsAppId: UniqueEntityID
  chatId: UniqueEntityID
  ack: MessageAck
  type: MessageType
  quoted: Quoted | null
  body: MessageBody | null
  media: MessageMedia | null
  contacts: Contact[] | null
  isForwarded: boolean
  isFromMe: boolean
  isGif: boolean
  createdAt: Date
  revokedAt: Date | null
  senderBy: AttendantProfile | null
  revokedBy: AttendantProfile | null
}

export type CreateMessageOptionalProps = Pick<
  MessageProps,
  | 'body'
  | 'contacts'
  | 'media'
  | 'revokedAt'
  | 'senderBy'
  | 'revokedBy'
  | 'ack'
  | 'createdAt'
  | 'isForwarded'
  | 'isFromMe'
  | 'isGif'
  | 'quoted'
>

export type CreateMessageProps = SetOptional<
  MessageProps,
  keyof CreateMessageOptionalProps
>

export abstract class Message<
  Props extends MessageProps<Props['quoted']>,
> extends Entity<Props> {
  protected constructor(
    props: SetOptional<Props, keyof CreateMessageOptionalProps>,
    id?: UniqueEntityID,
  ) {
    super(
      {
        ...props,
        ack: props.ack ?? 'pending',
        body: props.body ?? null,
        contacts: props.contacts ?? null,
        media: props.media ?? null,
        senderBy: props.senderBy ?? null,
        revokedBy: props.revokedBy ?? null,
        quoted: props.quoted ?? null,
        isForwarded: props.isForwarded ?? false,
        isFromMe: props.isFromMe ?? true,
        isGif: props.isGif ?? false,
        createdAt: props.createdAt ?? new Date(),
        revokedAt: props.revokedAt ?? null,
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

  get ack() {
    return this.props.ack
  }

  get type() {
    return this.props.type
  }

  get quoted() {
    return this.props.quoted
  }

  hasQuoted(): this is SetNonNullable<MessageProps<Props['quoted']>, 'quoted'> {
    return !!this.quoted
  }

  get body() {
    return this.props.body
  }

  hasBody(): this is SetNonNullable<MessageProps<Props['quoted']>, 'body'> {
    return !!this.body
  }

  get contacts() {
    return this.props.contacts
  }

  hasContacts(): this is SetNonNullable<
    MessageProps<Props['quoted']>,
    'contacts'
  > {
    return !!this.contacts?.length
  }

  get media() {
    return this.props.media
  }

  hasMedia(): this is SetNonNullable<MessageProps<Props['quoted']>, 'media'> {
    return !!this.media && MESSAGE_MEDIA_TYPES.has(this.type)
  }

  get isForwarded() {
    return this.props.isForwarded
  }

  get isFromMe() {
    return this.props.isFromMe
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

  hasSender(): this is SetNonNullable<
    MessageProps<Props['quoted']>,
    'senderBy'
  > {
    return !!this.senderBy
  }

  get revokedBy() {
    return this.props.revokedBy
  }

  revoke(by?: AttendantProfile | null) {
    this.set({
      revokedBy: by,
      revokedAt: new Date(),
      type: 'revoked',
      body: null,
      media: null,
      quoted: null,
      contacts: null,
    } as Props)
  }

  hasRevoker(): this is SetNonNullable<
    MessageProps<Props['quoted']>,
    'revokedBy'
  > {
    return !!this.revokedBy
  }

  abstract toQuoted(): NonNullable<Props['quoted']>
}
