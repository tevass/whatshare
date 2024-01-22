import { WhatsApp } from '@/domain/chat/enterprise/entities/whats-app'

import { WsWhatsApp } from '@whatshare/ws-schemas/entities'

export class WhatsAppPresenter {
  static toWs(whatsApp: WhatsApp): WsWhatsApp {
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
