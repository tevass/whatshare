import {
  WhatsAppEmitter,
  WhatsAppEmitterPayload,
} from '@/domain/chat/application/emitters/whats-app-emitter'
import { WhatsApp } from '@/domain/chat/enterprise/entities/whats-app'
import { WhatsAppPresenter } from '@/infra/presenters/whats-app-presenter'
import { WebSocketServer } from '@nestjs/websockets'
import { Server } from 'socket.io'

import { WhatsAppServerEvents } from '@whatshare/ws-schemas/events'
import { WsNamespaceGateway } from '../decorators/ws-namespace-gateway.decorator'

@WsNamespaceGateway({ namespace: 'wa' })
export class WsWhatsAppEmitter implements WhatsAppEmitter {
  @WebSocketServer()
  private io!: Server<object, WhatsAppServerEvents>

  private getRoom = (whatsApp: WhatsApp) => whatsApp.id.toString()

  emitChange({ whatsApp }: WhatsAppEmitterPayload): void {
    const roomId = this.getRoom(whatsApp)

    this.io.to(roomId).emit('whatsApp:change', {
      whatsApp: WhatsAppPresenter.toWs(whatsApp),
    })
  }

  emitQrCode({ whatsApp }: WhatsAppEmitterPayload): void {
    const roomId = this.getRoom(whatsApp)

    this.io.to(roomId).emit('whatsApp:qrCode', {
      whatsApp: WhatsAppPresenter.toWs(whatsApp),
    })
  }

  emitConnected({ whatsApp }: WhatsAppEmitterPayload): void {
    const roomId = this.getRoom(whatsApp)

    this.io.to(roomId).emit('whatsApp:connected', {
      whatsApp: WhatsAppPresenter.toWs(whatsApp),
    })
  }

  emitDisconnected({ whatsApp }: WhatsAppEmitterPayload): void {
    const roomId = this.getRoom(whatsApp)

    this.io.to(roomId).emit('whatsApp:disconnected', {
      whatsApp: WhatsAppPresenter.toWs(whatsApp),
    })
  }
}
