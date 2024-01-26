import { Injectable } from '@nestjs/common'
import { WsException } from '@nestjs/websockets'
import { mongoId } from '@whatshare/shared-schemas'
import type { Socket } from 'socket.io'
import { z } from 'zod'
import { fromZodError } from 'zod-validation-error'
import { WSMiddleware, WSMiddlewareNext } from './ws-middleware'

const querySchema = z.object({
  room: mongoId,
})

@Injectable()
export class WSJoinRoomMiddleware implements WSMiddleware {
  execute(socket: Socket, next: WSMiddlewareNext) {
    const query = querySchema.safeParse(socket.handshake.query)

    if (!query.success) {
      return next(
        new WsException({
          message: 'Invalid room ID',
          errors: fromZodError(query.error),
        }),
      )
    }

    const roomId = query.data.room
    socket.join(roomId)

    socket.handshake.query = query.data

    next()
  }
}
