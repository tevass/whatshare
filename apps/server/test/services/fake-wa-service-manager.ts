import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WAService } from '@/domain/chat/application/services/wa-service'
import { WAServiceManager } from '@/domain/chat/application/services/wa-service-manager'
import { FakeWAService } from './fake-wa-service'
import { WhatsApp } from '@/domain/chat/enterprise/entities/whats-app'

export class FakeWAServiceManager implements WAServiceManager {
  services: Map<string, FakeWAService> = new Map()

  get(whatsAppId: UniqueEntityID): WAService | null {
    const service = this.services.get(whatsAppId.toString())
    return service && service.isConnected() ? service : null
  }

  updateFromWhatsApp(whatsApp: WhatsApp): void {
    const hasService = this.services.get(whatsApp.id.toString())
    if (!hasService) return

    this.services.set(
      whatsApp.id.toString(),
      FakeWAService.createFromWhatsApp(whatsApp),
    )
  }
}
