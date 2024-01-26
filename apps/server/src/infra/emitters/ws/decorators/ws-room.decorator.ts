import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import type { Socket } from 'socket.io'

export const WsRoom = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const socket = context.switchToWs().getClient() as Socket

    return socket.handshake.query.room as string
  },
)
