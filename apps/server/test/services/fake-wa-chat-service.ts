import { WAEntityID } from '@/core/entities/wa-entity-id'
import { WAChatService } from '@/domain/chat/application/services/wa-chat-service'

export class FakeWAChatService implements WAChatService {
  values: string[] = []

  async sendSeenById(chatId: WAEntityID): Promise<boolean> {
    this.values.push(chatId.toString())
    return true
  }

  async markUnreadById(chatId: WAEntityID): Promise<boolean> {
    this.values.push(chatId.toString())
    return true
  }
}
