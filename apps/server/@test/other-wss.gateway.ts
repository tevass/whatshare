import { ZodWssValidationPipe } from '@/infra/http/pipes/zod-wss-validation-pipe'
import { UsePipes } from '@nestjs/common'
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets'
import { Socket } from 'socket.io'
import { z } from 'zod'

const testSchema = z.object({
  ok: z.boolean(),
})

@WebSocketGateway()
export class OtherGateway {
  @SubscribeMessage('test')
  @UsePipes(new ZodWssValidationPipe(testSchema))
  handle(@ConnectedSocket() client: Socket, @MessageBody() data: unknown) {
    console.log('AQUI', client.handshake.headers.user, data)
  }
}
