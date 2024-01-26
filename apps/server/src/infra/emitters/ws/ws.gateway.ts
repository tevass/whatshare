import { OnModuleInit } from '@nestjs/common'
import { WebSocketServer } from '@nestjs/websockets'
import { Server } from 'socket.io'
import { WsNamespaceGateway } from './decorators/ws-namespace-gateway.decorator'
import { WSJoinRoomMiddleware } from './ws-join-room-middleware'

@WsNamespaceGateway({ namespace: 'wa' })
export class WsGateway implements OnModuleInit {
  constructor(private joinRoomMiddleware: WSJoinRoomMiddleware) {}

  @WebSocketServer()
  private server!: Server

  onModuleInit() {
    this.server.use(this.joinRoomMiddleware.execute)
  }
}
