import { WAEntityID } from '@/core/entities/wa-entity-id'
import { WAChat } from '@/domain/chat/application/entities/wa-chat'
import { Client } from 'whatsapp-web.js'
import { WWJSChatMapper } from '../mappers/wwjs-chat-mapper'
import { WAChatClient } from '@/domain/chat/application/services/wa-client-manager/clients/wa-chat-client'
import { WWJSClient } from './wwjs-client'
import { Time } from '@/infra/utils/time'

export class WWJSChatClient implements WAChatClient {
  private raw: Client

  protected constructor(private wwjsClient: WWJSClient) {
    this.raw = wwjsClient.switchToRaw()
  }

  private async getRawById(chatId: WAEntityID) {
    return await this.raw.getChatById(chatId.toString())
  }

  async getById(chatId: WAEntityID): Promise<WAChat> {
    const raw = await this.getRawById(chatId)

    return await WWJSChatMapper.toDomain({
      raw,
      client: this.raw,
      waClientId: this.wwjsClient.id,
    })
  }

  async sendSeenById(chatId: WAEntityID): Promise<void> {
    const waChat = await this.getRawById(chatId)
    await waChat.sendSeen()
    await Time.delay()
  }

  async markUnreadById(chatId: WAEntityID): Promise<void> {
    const waChat = await this.getRawById(chatId)
    await waChat.markUnread()
    await Time.delay()
  }

  async clearById(chatId: WAEntityID): Promise<void> {
    const waChat = await this.getRawById(chatId)
    await waChat.clearMessages()
    await Time.delay()
  }

  async getMany(): Promise<WAChat[]> {
    const waChats = await this.raw.getChats()

    return await Promise.all(
      waChats.map((raw) =>
        WWJSChatMapper.toDomain({
          raw,
          client: this.raw,
          waClientId: this.wwjsClient.id,
        }),
      ),
    )
  }

  static create(client: WWJSClient) {
    return new WWJSChatClient(client)
  }
}
