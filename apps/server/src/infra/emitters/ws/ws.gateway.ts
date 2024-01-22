import { OnGatewayConnection } from '@nestjs/websockets'
import { WsNamespaceWAGateway } from './decorators/ws-namespace-wa-gateway.decorator'
import { Socket } from 'socket.io'
import { HandleWSConnection } from './handle-connection'

@WsNamespaceWAGateway()
export class WsGateway implements OnGatewayConnection {
  constructor(private handleWSConnection: HandleWSConnection) {}

  async handleConnection(socket: Socket) {
    await this.handleWSConnection.execute(socket)
  }
}
