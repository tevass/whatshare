import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WAEntityID } from '@/core/entities/wa-entity-id'
import type { SetNonNullable } from 'type-fest'
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

export class Chat<Props extends ChatProps> extends Entity<Props> {
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
    this.set({ unreadCount: 0 } as Partial<Props>)
  }

  unread() {
    this.set({ unreadCount: -1 } as Partial<Props>)
  }

  clear() {
    this.set({
      unreadCount: 0,
      lastMessage: null,
      deletedAt: new Date(),
    } as Partial<Props>)
  }

  interact(message: Message) {
    this.set({
      lastInteraction: message.createdAt,
      lastMessage: message,
      deletedAt: null,
    } as Partial<Props>)
  }
}
