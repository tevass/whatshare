import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WAEntityID } from '@/core/entities/wa-entity-id'
import type { SetNonNullable, SetOptional } from 'type-fest'
import { Contact } from './contact'

export interface ChatProps<LastMessage = null> {
  waChatId: WAEntityID
  whatsAppId: UniqueEntityID
  contact: Contact
  unreadCount: number
  lastInteraction: Date | null
  lastMessage: LastMessage | null
  deletedAt: Date | null
}

export type CreateChatProps = SetOptional<
  ChatProps,
  'lastInteraction' | 'lastMessage' | 'deletedAt'
>

export abstract class Chat<
  Props extends ChatProps<Props['lastMessage']>,
> extends Entity<Props> {
  protected constructor(
    props: SetOptional<Props, keyof CreateChatProps>,
    id?: UniqueEntityID,
  ) {
    super(
      {
        ...props,
        lastInteraction: props.lastInteraction ?? null,
        lastMessage: props.lastMessage ?? null,
        deletedAt: props.deletedAt ?? null,
      } as Props,
      id,
    )
  }

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

  hasMessage(): this is SetNonNullable<ChatProps<Props>, 'lastMessage'> {
    return !!this.lastMessage
  }

  get deletedAt() {
    return this.props.deletedAt
  }

  isDeleted(): this is SetNonNullable<ChatProps<Props>, 'deletedAt'> {
    return !!this.deletedAt
  }

  isActive(): this is typeof this & { deletedAt: null } {
    return !this.deletedAt
  }

  read() {
    this.set({ unreadCount: 0 } as Props)
  }

  unread() {
    this.set({ unreadCount: -1 } as Props)
  }

  clear() {
    this.set({
      unreadCount: 0,
      lastMessage: null,
      deletedAt: new Date(),
    } as Props)
  }

  interact<Message extends Props['lastMessage'] & { createdAt: Date }>(
    message: Message,
  ) {
    this.set({
      lastInteraction: message.createdAt,
      lastMessage: message,
      deletedAt: null,
    } as Props)
  }
}
