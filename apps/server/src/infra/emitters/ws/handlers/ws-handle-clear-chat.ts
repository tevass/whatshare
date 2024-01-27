import { HandleClearChat } from '@/domain/chat/application/handlers/handle-clear-chat'
import { WsJwtAuthGuard } from '@/infra/auth/guards/ws-jwt.guard'
import { UseGuards } from '@nestjs/common'
import { MessageBody } from '@nestjs/websockets'
import {
  ChatClearClientPayload,
  ChatClientEvents,
  chatClearClientPayload,
} from '@whatshare/ws-schemas/events'
import { WsNamespaceGateway } from '../decorators/ws-namespace-gateway.decorator'
import { WsRoom } from '../decorators/ws-room.decorator'
import { WsSubscribeEvent } from '../decorators/ws-subscribe-event.decorator'
import { ZodWsValidationPipe } from '../pipes/zod-ws-validation-pipe'

@WsNamespaceGateway({ namespace: 'wa' })
@UseGuards(WsJwtAuthGuard)
export class WsHandleClearChat {
  constructor(private handleClearChat: HandleClearChat) {}

  @WsSubscribeEvent<ChatClientEvents>('chat:clear')
  async register(
    @MessageBody(new ZodWsValidationPipe(chatClearClientPayload))
    payload: ChatClearClientPayload,
    @WsRoom() whatsAppId: string,
  ) {
    const { waChatId } = payload

    await this.handleClearChat.execute({
      waChatId,
      whatsAppId,
    })
  }
}
