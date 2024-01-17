import { WAEntityID } from '@/core/entities/wa-entity-id'
import { WAChat } from '@/domain/chat/application/entities/wa-chat'
import { WAChatService } from '@/domain/chat/application/services/wa-chat-service'
import { Client } from 'whatsapp-web.js'
import { WAWebJSService } from '../wa-web-js'

export class WAWebJSChatService implements WAChatService {
  private raw: Client

  protected constructor(private waService: WAWebJSService) {
    this.raw = waService.switchToRaw()
  }

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

  static create(client: WAWebJSService) {
    return new WAWebJSChatService(client)
  }
}
