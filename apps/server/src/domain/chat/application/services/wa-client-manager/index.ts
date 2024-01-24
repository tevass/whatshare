import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WAClient } from './clients/wa-client'
import { WhatsApp } from '@/domain/chat/enterprise/entities/whats-app'

export abstract class WAClientManager {
  abstract getConnected(waClientId: UniqueEntityID): WAClient | null
  abstract setFromWhatsApp(whatsApp: WhatsApp): void
}
