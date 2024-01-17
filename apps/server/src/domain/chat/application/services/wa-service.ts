import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WAChatService } from './wa-chat-service'
import { WAContactService } from './wa-contact-service'
import { WAMessageService } from './wa-message-service'
import { WhatsAppStatus } from '@/schemas/core/whats-app-status'

export abstract class WAService {
  abstract whatsAppId: UniqueEntityID
  abstract status: WhatsAppStatus
  abstract chat: WAChatService
  abstract message: WAMessageService
  abstract contact: WAContactService

  isDisconnected(): this is this & { status: 'disconnected' } {
    return this.status === 'disconnected'
  }

  isConnected(): this is this & { status: 'connected' } {
    return this.status === 'connected'
  }
}
