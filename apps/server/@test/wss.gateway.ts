import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Socket } from 'socket.io'
import { OtherGateway } from './other-wss.gateway'

@WebSocketGateway()
export class WssGateway implements OnGatewayConnection {
  private otherGateway!: OtherGateway

  @WebSocketServer()
  private server!: Socket

  handleConnection(socket: Socket): void {
    console.log(socket.id)
    socket.handshake.headers.user = '@test'
  }
}
