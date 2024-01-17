import { WAEntityID } from '@/core/entities/wa-entity-id'
import { WAMessage } from '@/domain/chat/application/entities/wa-message'
import {
  WAMessageMethods,
  WAMessageSendTextParams,
} from '@/domain/chat/application/services/wa-service'
import WAWebJS from 'whatsapp-web.js'

export class WAWebJSMessageMethods implements WAMessageMethods {
  protected constructor(private client: WAWebJS.Client) {}

  sendText(params: WAMessageSendTextParams): Promise<WAMessage> {
    throw new Error('Method not implemented.')
  }

  getByChatId(chatId: WAEntityID): Promise<WAMessage[]> {
    throw new Error('Method not implemented.')
  }

  static create(client: WAWebJS.Client) {
    return new WAWebJSMessageMethods(client)
  }
}
