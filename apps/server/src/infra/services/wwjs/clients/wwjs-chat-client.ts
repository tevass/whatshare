import { WAEntityID } from '@/core/entities/wa-entity-id'
import { WAChat } from '@/domain/chat/application/entities/wa-chat'
import { Client } from 'whatsapp-web.js'
import { WWJSChatMapper } from '../mappers/wwjs-chat-mapper'
import { WAChatClient } from '@/domain/chat/application/services/wa-client-manager/clients/wa-chat-client'
import { WWJSClient } from './wwjs-client'
import { Time } from '@/infra/utils/time'

export class WWJSChatClient implements WAChatClient {
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
    await Time.delay()
  }

  async markUnreadById(chatId: WAEntityID): Promise<void> {
    const waChat = await this.getById(chatId)
    await waChat.markUnread()
    await Time.delay()
  }

  async clearById(chatId: WAEntityID): Promise<void> {
    const waChat = await this.getById(chatId)
    await waChat.clearMessages()
    await Time.delay()
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
    return new WWJSChatClient(client)
  }
}
