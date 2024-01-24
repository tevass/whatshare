import { WebSocketServer } from '@nestjs/websockets'
import { WsNamespaceWAGateway } from './decorators/ws-namespace-wa-gateway.decorator'
import { Server } from 'socket.io'
import { OnModuleInit } from '@nestjs/common'
import { WSJoinRoomMiddleware } from './ws-join-room-middleware'

@WsNamespaceWAGateway()
export class WsGateway implements OnModuleInit {
  constructor(private joinRoomMiddleware: WSJoinRoomMiddleware) {}

  @WebSocketServer()
  private server!: Server

  onModuleInit() {
    this.server.use(this.joinRoomMiddleware.execute)
  }
}
