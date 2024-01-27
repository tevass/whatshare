import { WAEntityID } from '@/core/entities/wa-entity-id'
import { WAMessage } from '@/domain/chat/application/entities/wa-message'
import {
  WAMessageClient,
  WAMessageSendTextParams,
} from '@/domain/chat/application/services/wa-client-manager/clients/wa-message-client'
import WWJS from 'whatsapp-web.js'
import { WWJSMessageMapper } from '../mappers/wwjs-message-mapper'
import { WWJSClient } from './wwjs-client'

export class WWJSMessageClient implements WAMessageClient {
  private raw: WWJS.Client

  protected constructor(private waClient: WWJSClient) {
    this.raw = waClient.switchToRaw()
  }

  private async getChatById(chatId: WAEntityID) {
    return await this.raw.getChatById(chatId.toString())
  }

  async sendText(params: WAMessageSendTextParams): Promise<WAMessage> {
    const { body, chatId, quotedId } = params

    const waChat = await this.getChatById(chatId)
    const waMessage = await waChat.sendMessage(body, {
      quotedMessageId: quotedId?.toString(),
    })

    return await WWJSMessageMapper.toDomain({ raw: waMessage, chatId })
  }

  async getManyByChatId(chatId: WAEntityID): Promise<WAMessage[]> {
    const waChat = await this.getChatById(chatId)

    const waMessages = await waChat.fetchMessages({
      limit: Infinity,
    })

    return await Promise.all(
      waMessages.map((raw) => WWJSMessageMapper.toDomain({ raw, chatId })),
    )
  }

  static create(client: WWJSClient) {
    return new WWJSMessageClient(client)
  }
}
