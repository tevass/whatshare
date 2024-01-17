import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WAService } from '@/domain/chat/application/services/wa-service'
import { WAServiceManager } from '@/domain/chat/application/services/wa-service-manager'
import { FakeWAService } from './fake-wa-service'

export class FakeWAServiceManager implements WAServiceManager {
  services: Map<string, FakeWAService> = new Map()

  get(whatsAppId: UniqueEntityID): WAService | null {
    const service = this.services.get(whatsAppId.toString())
    return service && service.isConnected() ? service : null
  }
}
