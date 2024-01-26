import { ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Socket } from 'socket.io'

@Injectable()
export class WsJwtAuthGuard extends AuthGuard('ws-jwt') {
  constructor() {
    super()
  }

  getRequest(context: ExecutionContext) {
    const socket = context.switchToWs().getClient() as Socket
    return socket.handshake
  }
}
