import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Socket } from 'socket.io'
import { WssService } from './wss.service'

@WebSocketGateway()
export class WssGateway implements OnGatewayConnection {
  @WebSocketServer()
  private server!: Socket

  constructor(private readonly wssService: WssService) {}

  handleConnection(socket: Socket): void {
    this.wssService.handleConnection(socket)
  }

  // Implement other Socket.IO event handlers and message handlers
}
