import { HandleUnreadChat } from '@/domain/chat/application/handlers/handle-unread-chat'
import { WsJwtAuthGuard } from '@/infra/auth/guards/ws-jwt.guard'
import { UseGuards } from '@nestjs/common'
import { MessageBody } from '@nestjs/websockets'
import {
  ChatClientEvents,
  ChatUnreadClientPayload,
  chatUnreadClientPayload,
} from '@whatshare/ws-schemas/events'
import { WsNamespaceGateway } from '../decorators/ws-namespace-gateway.decorator'
import { WsRoom } from '../decorators/ws-room.decorator'
import { WsSubscribeEvent } from '../decorators/ws-subscribe-event.decorator'
import { ZodWsValidationPipe } from '../pipes/zod-ws-validation-pipe'

@WsNamespaceGateway({ namespace: 'wa' })
@UseGuards(WsJwtAuthGuard)
export class WsHandleUnreadChat {
  constructor(private handleUnreadChat: HandleUnreadChat) {}

  @WsSubscribeEvent<ChatClientEvents>('chat:unread')
  async register(
    @MessageBody(new ZodWsValidationPipe(chatUnreadClientPayload))
    payload: ChatUnreadClientPayload,
    @WsRoom() whatsAppId: string,
  ) {
    const { waChatId } = payload

    await this.handleUnreadChat.execute({
      waChatId,
      whatsAppId,
    })
  }
}
