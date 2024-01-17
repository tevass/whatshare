import { WAService } from '@/domain/chat/application/services/wa-service'
import { FakeWAChatService } from './fake-wa-chat-service'
import { FakeWAMessageService } from './fake-wa-message-service'
import { FakeWAContactService } from './fake-wa-contact-service'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WhatsAppStatus } from '@/schemas/core/whats-app-status'
import { WhatsApp } from '@/domain/chat/enterprise/entities/whats-app'

interface FakeWAServiceProps {
  status: WhatsAppStatus
  whatsAppId: UniqueEntityID
}

export class FakeWAService extends WAService {
  private props: FakeWAServiceProps

  chat: FakeWAChatService
  message: FakeWAMessageService
  contact: FakeWAContactService

  protected constructor(props: FakeWAServiceProps) {
    super()

    this.props = props
    this.chat = new FakeWAChatService()
    this.message = new FakeWAMessageService()
    this.contact = new FakeWAContactService()
  }

  get status() {
    return this.props.status
  }

  get whatsAppId() {
    return this.props.whatsAppId
  }

  static createFromWhatsApp(whatsApp: WhatsApp) {
    return new FakeWAService({
      whatsAppId: whatsApp.id,
      status: whatsApp.status,
    })
  }
}
