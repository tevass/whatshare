import { OnGatewayConnection } from '@nestjs/websockets'
import { Socket } from 'socket.io'
import { WssNamespaceGateway } from './decorators/wss-namespace-gateway.decorator'

@WssNamespaceGateway({ namespace: 'wa' })
export class WssService implements OnGatewayConnection {
  handleConnection(client: Socket) {
    // client.handshake.headers[]
  }
}
