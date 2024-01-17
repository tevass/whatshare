import { WAEntityID } from '@/core/entities/wa-entity-id'
import { WAChat } from '@/domain/chat/application/entities/wa-chat'
import { WAChatMethods } from '@/domain/chat/application/services/wa-service'
import WAWebJS from 'whatsapp-web.js'

export class WAWebJSChatMethods implements WAChatMethods {
  protected constructor(private client: WAWebJS.Client) {}

  sendSeenById(chatId: WAEntityID): Promise<void> {
    throw new Error('Method not implemented.')
  }

  markUnreadById(chatId: WAEntityID): Promise<void> {
    throw new Error('Method not implemented.')
  }

  clearById(chatId: WAEntityID): Promise<void> {
    throw new Error('Method not implemented.')
  }

  getMany(): Promise<WAChat[]> {
    throw new Error('Method not implemented.')
  }

  static create(client: WAWebJS.Client) {
    return new WAWebJSChatMethods(client)
  }
}
