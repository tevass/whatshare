import { WebSocketServer } from '@nestjs/websockets'
import { Server } from 'socket.io'
import { OnModuleInit } from '@nestjs/common'
import { WSJoinRoomMiddleware } from './ws-join-room-middleware'
import { WsNamespaceGateway } from './decorators/ws-namespace-gateway.decorator'

@WsNamespaceGateway({ namespace: 'wa' })
export class WsGateway implements OnModuleInit {
  constructor(private joinRoomMiddleware: WSJoinRoomMiddleware) {}

  @WebSocketServer()
  private server!: Server

  onModuleInit() {
    this.server.use(this.joinRoomMiddleware.execute)
  }
}
