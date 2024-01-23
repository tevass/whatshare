import { WAService } from '@/domain/chat/application/services/wa-service'
import { FakeWAChatService } from './fake-wa-chat-service'
import { FakeWAMessageService } from './fake-wa-message-service'
import { FakeWAContactService } from './fake-wa-contact-service'
import {
  WhatsApp,
  WhatsAppProps,
} from '@/domain/chat/enterprise/entities/whats-app'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export class FakeWAService extends WAService {
  chat: FakeWAChatService
  message: FakeWAMessageService
  contact: FakeWAContactService

  protected constructor(props: WhatsAppProps, id: UniqueEntityID) {
    super(props, id)

    this.props = props
    this.chat = new FakeWAChatService()
    this.message = new FakeWAMessageService()
    this.contact = new FakeWAContactService()
  }

  static createFromWhatsApp(whatsApp: WhatsApp) {
    return new FakeWAService(
      {
        name: whatsApp.name,
        qrCode: whatsApp.qrCode,
        status: whatsApp.status,
      },
      whatsApp.id,
    )
  }
}
