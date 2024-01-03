import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  WAClientServices,
  WAService,
} from '@/domain/chat/application/services/wa-service'
import { FakeWAChatService } from './fake-wa-chat-service'
import { FakeWAMessageService } from './fake-wa-message-service'

export class FakeWAClientServices extends WAClientServices {
  get chat() {
    return this.props.chat as FakeWAChatService
  }

  get message() {
    return this.props.message as FakeWAMessageService
  }

  static create(id?: UniqueEntityID) {
    return new FakeWAClientServices(
      {
        chat: new FakeWAChatService(),
        message: new FakeWAMessageService(),
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
