import { Server } from 'socket.io'
import { WsNamespaceWAGateway } from './decorators/ws-namespace-wa-gateway.decorator'
import { WebSocketServer } from '@nestjs/websockets'
import {
  WhatsAppEmitter,
  WhatsAppEmitterPayload,
} from '@/domain/chat/application/emitters/whats-app-emitter'
import { WhatsApp } from '@/domain/chat/enterprise/entities/whats-app'
import { WhatsAppPresenter } from '@/infra/presenters/whats-app-presenter'

import { WhatsAppServerEvents } from '@whatshare/ws-schemas/events'

@WsNamespaceWAGateway()
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
}
