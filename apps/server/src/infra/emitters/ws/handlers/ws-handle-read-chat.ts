import { HandleReadChat } from '@/domain/chat/application/handlers/handle-read-chat'
import { WsJwtAuthGuard } from '@/infra/auth/guards/ws-jwt.guard'
import { UseGuards, UsePipes } from '@nestjs/common'
import { MessageBody } from '@nestjs/websockets'
import {
  ChatClientEvents,
  ChatReadClientPayload,
  chatReadClientPayload,
} from '@whatshare/ws-schemas/events'
import { WsNamespaceGateway } from '../decorators/ws-namespace-gateway.decorator'
import { WsRoom } from '../decorators/ws-room.decorator'
import { WsSubscribeEvent } from '../decorators/ws-subscribe-event.decorator'
import { ZodWsValidationPipe } from '../pipes/zod-ws-validation-pipe'

@WsNamespaceGateway({ namespace: 'wa' })
@UseGuards(WsJwtAuthGuard)
export class WsHandleReadChat {
  constructor(private handleReadChat: HandleReadChat) {}

  @WsSubscribeEvent<ChatClientEvents>('chat:read')
  @UsePipes(new ZodWsValidationPipe(chatReadClientPayload))
  async register(
    @MessageBody() payload: ChatReadClientPayload,
    @WsRoom() whatsAppId: string,
  ) {
    const { waChatId } = payload

    await this.handleReadChat.execute({
      waChatId,
      whatsAppId,
    })
  }
}
