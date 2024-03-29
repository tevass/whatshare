import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WAEntity } from '@/core/entities/wa-entity'
import { WAEntityID } from '@/core/entities/wa-entity-id'
import type { SetNonNullable, SetOptional } from 'type-fest'
import { CreateChatProps } from '../../enterprise/entities/chat'
import { GroupChat } from '../../enterprise/entities/group-chat'
import { PrivateChat } from '../../enterprise/entities/private-chat'
import { WAContact } from './wa-contact'
import { WAMessage } from './wa-message'

export interface WAChatProps {
  name: string
  timestamp: number
  unreadCount: number
  isGroup: boolean
  imageUrl: string | null
  lastMessage: WAMessage | null
  contact: WAContact
  waClientId: UniqueEntityID
  participants: WAContact[] | null
}

export class WAChat extends WAEntity<WAChatProps, WAEntityID> {
  get name() {
    return this.props.name
  }

  get timestamp() {
    return this.props.timestamp
  }

  get unreadCount() {
    return this.props.unreadCount
  }

  isGroup(): this is SetNonNullable<WAChatProps, 'participants'> {
    return this.props.isGroup
  }

  get imageUrl() {
    return this.props.imageUrl
  }

  get lastMessage() {
    return this.props.lastMessage
  }

  hasLastMessage(): this is SetNonNullable<WAChatProps, 'lastMessage'> {
    return !!this.lastMessage
  }

  get contact() {
    return this.props.contact
  }

  get waClientId() {
    return this.props.waClientId
  }

  get participants() {
    return this.props.participants
  }

  hasParticipants(): this is SetNonNullable<WAChatProps, 'participants'> {
    return !!this.participants?.length
  }

  toChat() {
    const chatProps: CreateChatProps = {
      waChatId: this.id,
      unreadCount: this.unreadCount,
      whatsAppId: this.waClientId,
    }

    return this.isGroup()
      ? GroupChat.create({
          ...chatProps,
          group: this.contact.toGroup(),
        })
      : PrivateChat.create({
          ...chatProps,
          contact: this.contact.toContact(),
        })
  }

  static create(
    props: SetOptional<WAChatProps, 'imageUrl' | 'lastMessage'>,
    id: WAEntityID,
  ) {
    return new WAChat(
      {
        ...props,
        imageUrl: props.imageUrl ?? null,
        lastMessage: props.lastMessage ?? null,
      },
      id,
    )
  }
}
