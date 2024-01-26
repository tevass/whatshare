import { WsNamespaceGateway } from '../decorators/ws-namespace-gateway.decorator'
import { WsSubscribeEvent } from '../decorators/ws-subscribe-event.decorator'
import {
  MessageClientEvents,
  messageSendTextClientPayload,
  MessageSendTextClientPayload,
} from '@whatshare/ws-schemas/events'
import { MessageBody } from '@nestjs/websockets'
import { UsePipes } from '@nestjs/common'
import { ZodWsValidationPipe } from '../pipes/zod-ws-validation-pipe'
import { WsRoom } from '../decorators/ws-room.decorator'
import { HandleSendTextMessage } from '@/domain/chat/application/handlers/handle-send-text-message'
import { WsUser } from '@/infra/auth/decorators/ws-user.decorator'

@WsNamespaceGateway({ namespace: 'wa' })
export class WsHandleSendTextMessage {
  constructor(private handleSendTextMessage: HandleSendTextMessage) {}

  @WsSubscribeEvent<MessageClientEvents>('message:send:text')
  @UsePipes(new ZodWsValidationPipe(messageSendTextClientPayload))
  async register(
    @MessageBody() payload: MessageSendTextClientPayload,
    @WsRoom() whatsAppId: string,
    @WsUser('sub') attendantId: string,
  ) {
    const { waChatId, body, quotedId } = payload

    await this.handleSendTextMessage.execute({
      whatsAppId,
      attendantId,
      waChatId,
      body,
      quotedId,
    })
  }
}
