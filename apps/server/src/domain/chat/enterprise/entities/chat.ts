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
  lastInteraction: Date
  lastMessage: Message | null
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

  static create(
    props: SetOptional<ChatProps, 'lastInteraction' | 'lastMessage'>,
    id?: UniqueEntityID,
  ) {
    return new Chat(
      {
        ...props,
        lastInteraction: props.lastInteraction ?? new Date(),
        lastMessage: props.lastMessage ?? null,
      },
      id,
    )
  }
}
