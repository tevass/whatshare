import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WAEntityID } from '@/core/entities/wa-entity-id'
import { WAMessageID } from '@/core/entities/wa-message-id'
import { WAChat } from '../entities/wa-chat'
import { WAContact } from '../entities/wa-contact'
import { WAMessage } from '../entities/wa-message'

export abstract class WAService {
  abstract get(waClientId: string): WAClient | null
}

// WAClient

export abstract class WAClient {
  abstract id: UniqueEntityID
  // eslint-disable-next-line no-use-before-define
  abstract chat: WAChatMethods
  // eslint-disable-next-line no-use-before-define
  abstract message: WAMessageMethods
  // eslint-disable-next-line no-use-before-define
  abstract contact: WAContactMethods
}

// WAChatMethods

export abstract class WAChatMethods {
  abstract sendSeenById(chatId: WAEntityID): Promise<void>
  abstract markUnreadById(chatId: WAEntityID): Promise<void>
  abstract clearById(chatId: WAEntityID): Promise<void>
  abstract getMany(): Promise<WAChat[]>
}

// WAMessageMethods

export interface WAMessageSendTextParams {
  chatId: WAEntityID
  quotedId?: WAMessageID
  body: string
}

export abstract class WAMessageMethods {
  abstract sendText(params: WAMessageSendTextParams): Promise<WAMessage>

  abstract getByChatId(chatId: WAEntityID): Promise<WAMessage[]>
}

// WAContactMethods

export abstract class WAContactMethods {
  abstract getMany(): Promise<WAContact[]>
}
