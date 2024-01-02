import { Entity } from '@/core/entities/entity'
import { WAChatService } from './wa-chat-service'

export interface WAClientServicesProps {
  chat: WAChatService
}

export abstract class WAClientServices extends Entity<WAClientServicesProps> {
  get chat() {
    return this.props.chat
  }
}

export abstract class WAService {
  abstract get(waClientId: string): WAClientServices | null
}
