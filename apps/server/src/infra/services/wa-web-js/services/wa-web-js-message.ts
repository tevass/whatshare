import { WAEntityID } from '@/core/entities/wa-entity-id'
import { WAMessage } from '@/domain/chat/application/entities/wa-message'
import {
  WAMessageSendTextParams,
  WAMessageService,
} from '@/domain/chat/application/services/wa-message-service'
import { Client } from 'whatsapp-web.js'
import { WAWebJSMessageMapper } from '../mappers/wa-web-js-message-mapper'
import { WAWebJSClient } from '../wa-web-js-client'

export class WAWebJSMessageService implements WAMessageService {
  private raw: Client

  protected constructor(private waClient: WAWebJSClient) {
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

    return await WAWebJSMessageMapper.toDomain({ raw: waMessage, chatId })
  }

  async getManyByChatId(chatId: WAEntityID): Promise<WAMessage[]> {
    const waChat = await this.getChatById(chatId)

    const waMessages = await waChat.fetchMessages({
      limit: Infinity,
    })

    return await Promise.all(
      waMessages.map((raw) => WAWebJSMessageMapper.toDomain({ raw, chatId })),
    )
  }

  static create(client: WAWebJSClient) {
    return new WAWebJSMessageService(client)
  }
}
