import { WAEntityID } from '@/core/entities/wa-entity-id'
import { WAChatService } from '@/domain/chat/application/services/wa-chat-service'

export class FakeWAChatService implements WAChatService {
  values: string[] = []

  async sendSeenById(chatId: WAEntityID): Promise<void> {
    this.values.push(chatId.toString())
  }

  async markUnreadById(chatId: WAEntityID): Promise<void> {
    this.values.push(chatId.toString())
  }

  async clearById(chatId: WAEntityID): Promise<void> {
    this.values.push(chatId.toString())
  }
}
