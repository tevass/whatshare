import { Entity } from '@/core/entities/entity'
import { WAChatService } from './wa-chat-service'
import { WAMessageService } from './wa-message-service'

export interface WAClientServicesProps {
  chat: WAChatService
  message: WAMessageService
}

export abstract class WAClientServices extends Entity<WAClientServicesProps> {
  get chat() {
    return this.props.chat
  }

  get message() {
    return this.props.message
  }
}

export abstract class WAService {
  abstract get(waClientId: string): WAClientServices | null
}
