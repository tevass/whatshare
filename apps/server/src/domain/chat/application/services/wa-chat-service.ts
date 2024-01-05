import { WAEntityID } from '@/core/entities/wa-entity-id'
import { WAChat } from '../entities/wa-chat'

export abstract class WAChatService {
  abstract sendSeenById(chatId: WAEntityID): Promise<void>
  abstract markUnreadById(chatId: WAEntityID): Promise<void>
  abstract clearById(chatId: WAEntityID): Promise<void>
  abstract getMany(): Promise<WAChat[]>
}
