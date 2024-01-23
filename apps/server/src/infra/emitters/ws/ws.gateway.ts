import { WebSocketServer } from '@nestjs/websockets'
import { WsNamespaceWAGateway } from './decorators/ws-namespace-wa-gateway.decorator'
import { Server } from 'socket.io'
import { HandleWSConnection } from './handle-connection'
import { OnModuleInit } from '@nestjs/common'

@WsNamespaceWAGateway()
export class WsGateway implements OnModuleInit {
  constructor(private handleWSConnection: HandleWSConnection) {}

  @WebSocketServer()
  private server!: Server

  onModuleInit() {
    this.server.use((socket, next) => {
      const response = this.handleWSConnection.execute({ socket })

      if (response.isLeft()) {
        return next(response.value)
      }

      next()
    })
  }
}
