import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { Injectable, UsePipes } from '@nestjs/common'
import { ConnectedSocket, MessageBody } from '@nestjs/websockets'
import { Socket } from 'socket.io'
import { z } from 'zod'
import { WssService } from './wss.service'

const testSchema = z.object({
  ok: z.boolean(),
})

@Injectable()
export class HandleTest {
  constructor(private wssService: WssService) {
    this.wssService.addEvent(this)
  }

  name = 'test'

  @UsePipes(new ZodValidationPipe(testSchema))
  listener(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: z.infer<typeof testSchema>,
  ) {
    console.log('AQUI', data, client.id)
  }
}
