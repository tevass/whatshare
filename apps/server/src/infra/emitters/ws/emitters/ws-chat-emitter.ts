import { WebSocketServer } from '@nestjs/websockets'
import { Server } from 'socket.io'

import { ChatServerEvents } from '@whatshare/ws-schemas/events'
import {
  ChatEmitter,
  ChatEmitterPayload,
} from '@/domain/chat/application/emitters/chat-emitter'
import { Chat } from '@/domain/chat/enterprise/entities/chat'
import { ChatPresenter } from '@/infra/presenters/chat-presenter'
import { WsNamespaceGateway } from '../decorators/ws-namespace-gateway.decorator'

@WsNamespaceGateway({ namespace: 'wa' })
export class WsChatEmitter implements ChatEmitter {
  @WebSocketServer()
  private io!: Server<object, ChatServerEvents>

  private getRoom = (chat: Chat) => chat.whatsAppId.toString()

  emitChange({ chat }: ChatEmitterPayload): void {
    const roomId = this.getRoom(chat)

    this.io.to(roomId).emit('chat:change', {
      chat: ChatPresenter.toWs(chat),
    })
  }

  emitClear({ chat }: ChatEmitterPayload): void {
    const roomId = this.getRoom(chat)

    this.io.to(roomId).emit('chat:clear', {
      chat: ChatPresenter.toWs(chat),
    })
  }

  emitCreate({ chat }: ChatEmitterPayload): void {
    const roomId = this.getRoom(chat)

    this.io.to(roomId).emit('chat:create', {
      chat: ChatPresenter.toWs(chat),
    })
  }
}
