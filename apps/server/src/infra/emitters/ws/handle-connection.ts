import { Injectable } from '@nestjs/common'
import { WsException } from '@nestjs/websockets'
import { mongoId } from '@whatshare/shared-schemas'
import { Socket } from 'socket.io'
import { z } from 'zod'
import { fromZodError } from 'zod-validation-error'

const headersSchema = z.object({
  '@whatshare-room-id': mongoId,
})

@Injectable()
export class HandleWSConnection {
  async execute(socket: Socket) {
    const headers = headersSchema.safeParse(socket.handshake.headers)

    if (!headers.success) {
      socket.emit(
        'exception',
        new WsException({
          message: 'Invalid room ID',
          errors: fromZodError(headers.error),
        }),
      )

      return socket.disconnect()
    }

    const roomId = headers.data['@whatshare-room-id']
    socket.join(roomId)
  }
}
