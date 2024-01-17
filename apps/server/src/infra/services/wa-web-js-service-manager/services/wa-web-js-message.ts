import { WAEntityID } from '@/core/entities/wa-entity-id'
import { WAMessage } from '@/domain/chat/application/entities/wa-message'
import {
  WAMessageSendTextParams,
  WAMessageService,
} from '@/domain/chat/application/services/wa-message-service'
import { Client } from 'whatsapp-web.js'
import { WAWebJSService } from '../wa-web-js'

export class WAWebJSMessageService implements WAMessageService {
  private raw: Client

  protected constructor(private waService: WAWebJSService) {
    this.raw = waService.switchToRaw()
  }

  sendText(params: WAMessageSendTextParams): Promise<WAMessage> {
    throw new Error('Method not implemented.')
  }

  getByChatId(chatId: WAEntityID): Promise<WAMessage[]> {
    throw new Error('Method not implemented.')
  }

  static create(client: WAWebJSService) {
    return new WAWebJSMessageService(client)
  }
}
