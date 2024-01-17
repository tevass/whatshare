import { WAEntityID } from '@/core/entities/wa-entity-id'
import { WAChat } from '@/domain/chat/application/entities/wa-chat'
import { WAChatService } from '@/domain/chat/application/services/wa-chat-service'
import { Client } from 'whatsapp-web.js'
import { WAWebJSChatMapper } from '../mappers/wa-web-js-chat-mapper'
import { WAWebJSService } from '../wa-web-js-service'

export class WAWebJSChatService implements WAChatService {
  private raw: Client

  protected constructor(private waService: WAWebJSService) {
    this.raw = waService.switchToRaw()
  }

  private async getById(chatId: WAEntityID) {
    return await this.raw.getChatById(chatId.toString())
  }

  async sendSeenById(chatId: WAEntityID): Promise<void> {
    const waChat = await this.getById(chatId)
    await waChat.sendSeen()
  }

  async markUnreadById(chatId: WAEntityID): Promise<void> {
    const waChat = await this.getById(chatId)
    await waChat.markUnread()
  }

  async clearById(chatId: WAEntityID): Promise<void> {
    const waChat = await this.getById(chatId)
    await waChat.clearMessages()
  }

  async getMany(): Promise<WAChat[]> {
    const waChats = await this.raw.getChats()

    return await Promise.all(
      waChats.map((raw) =>
        WAWebJSChatMapper.toDomain({
          raw,
          waClientId: this.waService.whatsAppId,
        }),
      ),
    )
  }

  static create(client: WAWebJSService) {
    return new WAWebJSChatService(client)
  }
}
