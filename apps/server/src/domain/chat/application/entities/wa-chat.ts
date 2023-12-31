import { WAEntity } from '@/core/entities/wa-entity'
import { WAEntityID } from '@/core/entities/wa-entity-id'
import type { SetNonNullable, SetOptional } from 'type-fest'
import { WAMessage } from './wa-message'

export interface WAChatProps {
  name: string
  timestamp: number
  unreadCount: number
  isGroup: boolean
  imageUrl: string | null
  lastMessage: WAMessage | null
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

  get isGroup() {
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
