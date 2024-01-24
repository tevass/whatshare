import { WAEntityID } from '@/core/entities/wa-entity-id'
import { WAChat } from '@/domain/chat/application/entities/wa-chat'
import { WAChatClient } from '@/domain/chat/application/services/wa-client-manager/clients/wa-chat-client'

export class FakeWAChatClient implements WAChatClient {
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
