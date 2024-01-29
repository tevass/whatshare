import { WAEntity } from '@/core/entities/wa-entity'
import { WAEntityID } from '@/core/entities/wa-entity-id'
import { WAMessageID } from '@/core/entities/wa-message-id'
import type { MessageAck, MessageType } from '@whatshare/core-schemas/enums'
import type { SetNonNullable, SetOptional } from 'type-fest'
import { WAMessageMedia } from './value-objects/wa-message-media'
import { WAContact } from './wa-contact'

export interface WAMessageProps {
  chatId: WAEntityID
  author: WAEntityID | null
  ack: MessageAck
  type: MessageType
  body: string | null
  timestamp: number
  isBroadcast: boolean
  isForwarded: boolean
  isFromMe: boolean
  isStatus: boolean
  isGif: boolean
  media: WAMessageMedia | null
  // eslint-disable-next-line no-use-before-define
  quoted: WAMessage | null
  contacts: WAContact[] | null
  mentionedIds: WAEntityID[] | null
}

export class WAMessage extends WAEntity<WAMessageProps, WAMessageID> {
  get chatId() {
    return this.props.chatId
  }

  get author() {
    return this.props.author
  }

  hasAuthor(): this is SetNonNullable<WAMessageProps, 'author'> {
    return !!this.author
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

  get timestamp() {
    return this.props.timestamp
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

  get media() {
    return this.props.media
  }

  hasMedia(): this is SetNonNullable<WAMessageProps, 'media'> {
    return !!this.media
  }

  get quoted() {
    return this.props.quoted
  }

  hasQuoted(): this is SetNonNullable<WAMessageProps, 'quoted'> {
    return !!this.quoted
  }

  get contacts() {
    return this.props.contacts
  }

  hasContacts(): this is SetNonNullable<WAMessageProps, 'contacts'> {
    return (
      !!this.contacts?.length &&
      (this.type === 'vcard' || this.type === 'multi_vcard')
    )
  }

  get mentionedIds() {
    return this.props.mentionedIds
  }

  hasMentions(): this is SetNonNullable<WAMessageProps, 'mentionedIds'> {
    return !!this.mentionedIds?.length
  }

  static create(
    props: SetOptional<
      WAMessageProps,
      'body' | 'media' | 'quoted' | 'contacts' | 'mentionedIds' | 'author'
    >,
    id: WAMessageID,
  ) {
    return new WAMessage(
      {
        ...props,
        body: props.body ?? null,
        author: props.author ?? null,
        quoted: props.quoted ?? null,
        media: props.media ?? null,
        contacts: props.contacts ?? null,
        mentionedIds: props.mentionedIds ?? null,
      },
      id,
    )
  }
}
