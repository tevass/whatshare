import { WAEntityID } from '@/core/entities/wa-entity-id';

export abstract class WAChatService {
  abstract sendSeenById(chatId: WAEntityID): Promise<boolean>
  abstract markUnreadById(chatId: WAEntityID): Promise<boolean>
  abstract clearById(chatId: WAEntityID): Promise<boolean>
}
