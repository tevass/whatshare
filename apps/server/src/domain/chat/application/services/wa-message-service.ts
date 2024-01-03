import { WAEntityID } from '@/core/entities/wa-entity-id'
import { WAMessageID } from '@/core/entities/wa-message-id'
import { WAMessage } from '../entities/wa-message'

export interface WAMessageServiceSendTextParams {
  chatId: WAEntityID
  quotedId?: WAMessageID
  body: string
}

export abstract class WAMessageService {
  abstract sendText(params: WAMessageServiceSendTextParams): Promise<WAMessage>
}
