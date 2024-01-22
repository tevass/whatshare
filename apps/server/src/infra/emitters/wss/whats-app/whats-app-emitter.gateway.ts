import { Server } from 'socket.io'
import { WssNamespaceGateway } from '../decorators/wss-namespace-gateway.decorator'

import {
  WhatsAppEmitter,
  WhatsAppEmitterPayload,
} from '@/domain/chat/application/emitters/whats-app-emitter'
import { WhatsApp } from '@/domain/chat/enterprise/entities/whats-app'
import { WhatsAppPresenter } from '@/infra/presenters/whats-app-presenter'
import { WebSocketServer } from '@nestjs/websockets'
import type { WhatsAppServerEvents } from '@whatshare/wss-schemas/events'

@WssNamespaceGateway({ namespace: 'wa' })
export class WssWhatsAppEmitter implements WhatsAppEmitter {
  @WebSocketServer()
  private io!: Server<object, WhatsAppServerEvents>

  private getRoom = (whatsApp: WhatsApp) => whatsApp.id.toString()

  emitChange({ whatsApp }: WhatsAppEmitterPayload): void {
    const roomId = this.getRoom(whatsApp)

    this.io.to(roomId).emit('whatsApp:change', {
      whatsApp: WhatsAppPresenter.toWss(whatsApp),
    })
  }

  emitQrCode({ whatsApp }: WhatsAppEmitterPayload): void {
    const roomId = this.getRoom(whatsApp)

    this.io.to(roomId).emit('whatsApp:qrCode', {
      whatsApp: WhatsAppPresenter.toWss(whatsApp),
    })
  }
}
