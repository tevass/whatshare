import { Entity } from '@/core/entities/entity'
import { FakeWAChatService } from '@/test/services/fake-wa-chat-service'

export interface WAClientServicesProps {
  chat: FakeWAChatService
}

export abstract class WAClientServices extends Entity<WAClientServicesProps> {
  get chat() {
    return this.props.chat
  }
}

export abstract class WAService {
  abstract get(waClientId: string): WAClientServices | null
}
