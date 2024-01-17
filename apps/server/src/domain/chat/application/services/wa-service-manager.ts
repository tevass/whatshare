import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WAService } from './wa-service'

export abstract class WAServiceManager {
  abstract get(whatsAppId: UniqueEntityID): WAService | null
}
