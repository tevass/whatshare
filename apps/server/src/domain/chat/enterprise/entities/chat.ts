import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WAEntityID } from '@/core/entities/wa-entity-id'
import type { SetNonNullable, SetOptional } from 'type-fest'
import { Contact } from './contact'
import { Message } from './message'

export interface ChatProps {
  waChatId: WAEntityID
  whatsAppId: UniqueEntityID
  contact: Contact
  unreadCount: number
  lastInteraction: Date | null
  lastMessage: Message | null
  deletedAt: Date | null
}

export class Chat extends Entity<ChatProps> {
  get waChatId() {
    return this.props.waChatId
  }

  get whatsAppId() {
    return this.props.whatsAppId
  }

  get contact() {
    return this.props.contact
  }

  get unreadCount() {
    return this.props.unreadCount
  }

  get lastInteraction() {
    return this.props.lastInteraction
  }

  get lastMessage() {
    return this.props.lastMessage
  }

  hasMessage(): this is SetNonNullable<ChatProps, 'lastMessage'> {
    return !!this.lastMessage
  }

  get deletedAt() {
    return this.props.deletedAt
  }

  isDeleted(): this is SetNonNullable<ChatProps, 'deletedAt'> {
    return !!this.deletedAt
  }

  isActive(): this is ChatProps & { deletedAt: null } {
    return !this.deletedAt
  }

  read() {
    this.set({ unreadCount: 0 })
  }

  unread() {
    this.set({ unreadCount: -1 })
  }

  clear() {
    this.set({
      unreadCount: 0,
      lastMessage: null,
      deletedAt: new Date(),
    })
  }

  interact(message: Message) {
    this.set({
      lastInteraction: message.createdAt,
      lastMessage: message,
      deletedAt: null,
    })
  }

  static create(
    props: SetOptional<
      ChatProps,
      'lastInteraction' | 'lastMessage' | 'deletedAt'
    >,
    id?: UniqueEntityID,
  ) {
    return new Chat(
      {
        ...props,
        lastInteraction: props.lastInteraction ?? null,
        lastMessage: props.lastMessage ?? null,
        deletedAt: props.deletedAt ?? null,
      },
      id,
    )
  }
}
