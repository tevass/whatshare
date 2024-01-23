import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { WsException } from '@nestjs/websockets'
import { mongoId } from '@whatshare/shared-schemas'
import { Socket } from 'socket.io'
import { z } from 'zod'
import { fromZodError } from 'zod-validation-error'

const HEADER_ROOM = 'whatshare-room-id'

const headersSchema = z.object({
  [HEADER_ROOM]: mongoId,
})

interface HandleWSConnectionRequest {
  socket: Socket
}

type HandleWSConnectionResponse = Either<WsException, null>

@Injectable()
export class HandleWSConnection {
  execute(request: HandleWSConnectionRequest): HandleWSConnectionResponse {
    const { socket } = request

    const headers = headersSchema.safeParse(socket.handshake.headers)

    if (!headers.success) {
      socket.disconnect()

      return left(
        new WsException({
          message: 'Invalid room ID',
          errors: fromZodError(headers.error),
        }),
      )
    }

    const roomId = headers.data[HEADER_ROOM]
    socket.join(roomId)

    return right(null)
  }
}
