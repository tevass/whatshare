import { WAEntityID } from '@/core/entities/wa-entity-id'
import { WAChat } from '@/domain/chat/application/entities/wa-chat'
import { WAChatService } from '@/domain/chat/application/services/wa-chat-service'
import { Client } from 'whatsapp-web.js'
import { WWJSClient } from '../client'
import { WWJSChatMapper } from '../mappers/wwjs-chat-mapper'

export class WWJSChatService implements WAChatService {
  private raw: Client

  protected constructor(private waClient: WWJSClient) {
    this.raw = waClient.switchToRaw()
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
        WWJSChatMapper.toDomain({
          raw,
          waClientId: this.waClient.id,
        }),
      ),
    )
  }

  static create(client: WWJSClient) {
    return new WWJSChatService(client)
  }
}
