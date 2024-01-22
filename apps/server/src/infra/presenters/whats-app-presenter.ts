import { WhatsApp } from '@/domain/chat/enterprise/entities/whats-app'

import { WssWhatsApp } from '@whatshare/wss-schemas/entities'

export class WhatsAppPresenter {
  static toWss(whatsApp: WhatsApp): WssWhatsApp {
    return {
      id: whatsApp.id.toString(),
      name: whatsApp.name,
      qrCode: whatsApp.qrCode,
      status: whatsApp.status,
      isConnected: whatsApp.isConnected(),
      isDisconnected: whatsApp.isDisconnected(),
    }
  }
}
