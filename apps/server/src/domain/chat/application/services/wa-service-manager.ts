import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WAService } from './wa-service'
import { WhatsApp } from '../../enterprise/entities/whats-app'

export abstract class WAServiceManager {
  abstract get(whatsAppId: UniqueEntityID): WAService | null
  abstract updateFromWhatsApp(whatsApp: WhatsApp): void
}
