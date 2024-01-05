import { WAEntityID } from '@/core/entities/wa-entity-id'
import { WAChat } from '@/domain/chat/application/entities/wa-chat'
import { WAChatService } from '@/domain/chat/application/services/wa-chat-service'

export class FakeWAChatService implements WAChatService {
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
