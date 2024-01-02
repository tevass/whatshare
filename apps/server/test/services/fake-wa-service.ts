import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  WAClientServices,
  WAService,
} from '@/domain/chat/application/services/wa-service'
import { FakeWAChatService } from './fake-wa-chat-service'

export class FakeWAClientServices extends WAClientServices {
  get chat() {
    return this.props.chat as FakeWAChatService
  }

  static create(id?: UniqueEntityID) {
    return new FakeWAClientServices(
      {
        chat: new FakeWAChatService(),
      },
      id,
    )
  }
}

export class FakeWAService implements WAService {
  clients: Map<string, FakeWAClientServices> = new Map()

  get(waClientId: string): FakeWAClientServices | null {
    return this.clients.get(waClientId) ?? null
  }
}
