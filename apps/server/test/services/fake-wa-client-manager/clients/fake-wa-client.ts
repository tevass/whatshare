import { FakeWAChatClient } from './fake-wa-chat-client'
import { FakeWAMessageClient } from './fake-wa-message-client'
import { FakeWAContactClient } from './fake-wa-contact-client'
import {
  WhatsApp,
  WhatsAppProps,
} from '@/domain/chat/enterprise/entities/whats-app'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WAClient } from '@/domain/chat/application/services/wa-client-manager/clients/wa-client'

export class FakeWAClient extends WAClient {
  chat: FakeWAChatClient
  message: FakeWAMessageClient
  contact: FakeWAContactClient

  protected constructor(props: WhatsAppProps, id: UniqueEntityID) {
    super(props, id)

    this.chat = new FakeWAChatClient()
    this.message = new FakeWAMessageClient()
    this.contact = new FakeWAContactClient()
  }

  static createFromWhatsApp(whatsApp: WhatsApp) {
    return new FakeWAClient(
      {
        name: whatsApp.name,
        qrCode: whatsApp.qrCode,
        status: whatsApp.status,
      },
      whatsApp.id,
    )
  }
}
