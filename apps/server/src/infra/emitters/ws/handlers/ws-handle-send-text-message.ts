import { HandleSendTextMessage } from '@/domain/chat/application/handlers/handle-send-text-message'
import { WsUser } from '@/infra/auth/decorators/ws-user.decorator'
import { WsJwtAuthGuard } from '@/infra/auth/guards/ws-jwt.guard'
import { UseGuards } from '@nestjs/common'
import { MessageBody } from '@nestjs/websockets'
import {
  MessageClientEvents,
  MessageSendTextClientPayload,
  messageSendTextClientPayload,
} from '@whatshare/ws-schemas/events'
import { WsNamespaceGateway } from '../decorators/ws-namespace-gateway.decorator'
import { WsRoom } from '../decorators/ws-room.decorator'
import { WsSubscribeEvent } from '../decorators/ws-subscribe-event.decorator'
import { ZodWsValidationPipe } from '../pipes/zod-ws-validation-pipe'

@WsNamespaceGateway({ namespace: 'wa' })
@UseGuards(WsJwtAuthGuard)
export class WsHandleSendTextMessage {
  constructor(private handleSendTextMessage: HandleSendTextMessage) {}

  @WsSubscribeEvent<MessageClientEvents>('message:send:text')
  async register(
    @MessageBody(new ZodWsValidationPipe(messageSendTextClientPayload))
    payload: MessageSendTextClientPayload,
    @WsRoom() whatsAppId: string,
    @WsUser('sub') attendantId: string,
  ) {
    const { waChatId, body, quotedId, waMentionsIds } = payload

    await this.handleSendTextMessage.execute({
      whatsAppId,
      attendantId,
      waChatId,
      body,
      quotedId,
      waMentionsIds,
    })
  }
}
