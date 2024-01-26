import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WhatsApp } from '@/domain/chat/enterprise/entities/whats-app'
import { WAClient } from './clients/wa-client'

export abstract class WAClientManager {
  abstract getConnectedClientById(waClientId: UniqueEntityID): WAClient | null
  abstract getSomeConnectedClient(): WAClient | null
  abstract setClientFromWhatsApp(whatsApp: WhatsApp): void
}
