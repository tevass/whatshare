import { WebSocketServer } from '@nestjs/websockets'
import { Server } from 'socket.io'

import {
  MessageEmitter,
  MessageEmitterPayload,
} from '@/domain/chat/application/emitters/message-emitter'
import { WsJwtAuthGuard } from '@/infra/auth/guards/ws-jwt.guard'
import { MessagePresenter } from '@/infra/presenters/message-presenter'
import { UseGuards } from '@nestjs/common'
import { MessageServerEvents } from '@whatshare/ws-schemas/events'
import { WsNamespaceGateway } from '../decorators/ws-namespace-gateway.decorator'
import { Message } from '@/domain/chat/enterprise/types/message'

@WsNamespaceGateway({ namespace: 'wa' })
@UseGuards(WsJwtAuthGuard)
export class WsMessageEmitter implements MessageEmitter {
  @WebSocketServer()
  private io!: Server<object, MessageServerEvents>

  private getRoom = (message: Message) => message.whatsAppId.toString()

  emitChange({ message }: MessageEmitterPayload): void {
    const roomId = this.getRoom(message)

    this.io.to(roomId).emit('message:change', {
      message: MessagePresenter.toWs(message),
    })
  }

  emitCreate({ message }: MessageEmitterPayload): void {
    const roomId = this.getRoom(message)

    this.io.to(roomId).emit('message:create', {
      message: MessagePresenter.toWs(message),
    })
  }

  emitRevoked({ message }: MessageEmitterPayload): void {
    const roomId = this.getRoom(message)

    this.io.to(roomId).emit('message:revoked', {
      message: MessagePresenter.toWs(message),
    })
  }
}
