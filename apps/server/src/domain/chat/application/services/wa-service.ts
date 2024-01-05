import { Entity } from '@/core/entities/entity'
import { WAChatService } from './wa-chat-service'
import { WAContactService } from './wa-contact-service'
import { WAMessageService } from './wa-message-service'

export interface WAClientServicesProps {
  chat: WAChatService
  message: WAMessageService
  contact: WAContactService
}

export abstract class WAClientServices extends Entity<WAClientServicesProps> {
  get chat() {
    return this.props.chat
  }

  get message() {
    return this.props.message
  }

  get contact() {
    return this.props.contact
  }
}

export abstract class WAService {
  abstract get(waClientId: string): WAClientServices | null
}
