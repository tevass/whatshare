import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WAClientManager } from '@/domain/chat/application/services/wa-client-manager'
import { WhatsApp } from '@/domain/chat/enterprise/entities/whats-app'
import { FakeWAClient } from './clients/fake-wa-client'

export class FakeWAClientManager implements WAClientManager {
  clients: Map<string, FakeWAClient> = new Map()

  getConnectedClientById(waClientId: UniqueEntityID): FakeWAClient | null {
    const client = this.clients.get(waClientId.toString())
    return client && client.isConnected() ? client : null
  }

  getSomeConnectedClient(): FakeWAClient | null {
    const clients = Array.from(this.clients.values())
    return clients[0] ?? null
  }

  setClientFromWhatsApp(whatsApp: WhatsApp): void {
    const hasClient = this.clients.get(whatsApp.id.toString())
    if (!hasClient) return

    this.clients.set(
      whatsApp.id.toString(),
      FakeWAClient.createFromWhatsApp(whatsApp),
    )
  }
}
