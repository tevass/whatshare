import { WAEntityID } from '@/core/entities/wa-entity-id'
import { WAMessageID } from '@/core/entities/wa-message-id'
import { WAMessage } from '../../../entities/wa-message'

export interface WAMessageSendTextParams {
  chatId: WAEntityID
  quotedId?: WAMessageID
  mentionsIds?: WAEntityID[]
  body: string
}

export abstract class WAMessageClient {
  abstract sendText(params: WAMessageSendTextParams): Promise<WAMessage>

  abstract getManyByChatId(chatId: WAEntityID): Promise<WAMessage[]>
}
