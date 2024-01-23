import { WAChatService } from './wa-chat-service'
import { WAContactService } from './wa-contact-service'
import { WAMessageService } from './wa-message-service'
import { WhatsApp } from '../../enterprise/entities/whats-app'

export abstract class WAService extends WhatsApp {
  abstract chat: WAChatService
  abstract message: WAMessageService
  abstract contact: WAContactService

  setFromWhatsApp(whatsApp: WhatsApp) {
    this.set({
      name: whatsApp.name,
      qrCode: whatsApp.qrCode,
      status: whatsApp.status,
    })
  }
}
