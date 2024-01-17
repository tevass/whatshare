import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WAEntityID } from '@/core/entities/wa-entity-id'
import { WAChat } from '@/domain/chat/application/entities/wa-chat'
import { WAContact } from '@/domain/chat/application/entities/wa-contact'
import { WAMessage } from '@/domain/chat/application/entities/wa-message'
import {
  WAChatMethods,
  WAClient,
  WAContactMethods,
  WAMessageMethods,
  WAMessageSendTextParams,
  WAService,
} from '@/domain/chat/application/services/wa-service'
import { makeWAMessage } from '../factories/make-wa-message'
import { makeWAMessageID } from '../factories/make-wa-message-id'

class FakeWAChatMethods implements WAChatMethods {
  values: string[] = []
  chats: WAChat[] = []

  async sendSeenById(chatId: WAEntityID): Promise<void> {
    this.values.push(chatId.toString())
  }

  async markUnreadById(chatId: WAEntityID): Promise<void> {
    this.values.push(chatId.toString())
  }

  async clearById(chatId: WAEntityID): Promise<void> {
    this.values.push(chatId.toString())
  }

  async getMany(): Promise<WAChat[]> {
    return this.chats
  }
}

class FakeWAMessageMethods implements WAMessageMethods {
  messages: WAMessage[] = []

  async sendText(params: WAMessageSendTextParams): Promise<WAMessage> {
    const { body, chatId, quotedId } = params

    const message = makeWAMessage(
      {
        body,
        chatId,
        ...(quotedId && {
          quoted: makeWAMessage({}, quotedId),
        }),
        isFromMe: true,
        ack: 'sent',
        contacts: [],
        isBroadcast: false,
        isForwarded: false,
        isGif: false,
        isStatus: false,
        media: null,
        type: 'text',
      },
      makeWAMessageID({ entityId: chatId, isFromMe: true }),
    )

    this.messages.push(message)

    return message
  }

  async getByChatId(chatId: WAEntityID): Promise<WAMessage[]> {
    return this.messages.filter((item) => item.chatId.equals(chatId))
  }
}

class FakeWAContactMethods implements WAContactMethods {
  contacts: WAContact[] = []

  async getMany(): Promise<WAContact[]> {
    return this.contacts
  }
}

export class FakeWAClient implements WAClient {
  protected constructor(id: UniqueEntityID) {
    this.id = id
    this.chat = new FakeWAChatMethods()
    this.message = new FakeWAMessageMethods()
    this.contact = new FakeWAContactMethods()
  }

  id: UniqueEntityID
  chat: FakeWAChatMethods
  message: FakeWAMessageMethods
  contact: FakeWAContactMethods

  static create(id?: UniqueEntityID) {
    return new FakeWAClient(id ?? new UniqueEntityID())
  }
}

export class FakeWAService implements WAService {
  clients: Map<string, FakeWAClient> = new Map()

  get(waClientId: string): FakeWAClient | null {
    return this.clients.get(waClientId) ?? null
  }
}
