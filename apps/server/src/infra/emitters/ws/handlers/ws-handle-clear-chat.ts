import { HandleClearChat } from '@/domain/chat/application/handlers/handle-clear-chat'
import { WsNamespaceGateway } from '../decorators/ws-namespace-gateway.decorator'
import { WsSubscribeEvent } from '../decorators/ws-subscribe-event.decorator'
import {
  ChatClientEvents,
  ChatClearClientPayload,
  chatClearClientPayload,
} from '@whatshare/ws-schemas/events'
import { MessageBody } from '@nestjs/websockets'
import { UsePipes } from '@nestjs/common'
import { ZodWsValidationPipe } from '../pipes/zod-ws-validation-pipe'
import { WsRoom } from '../decorators/ws-room.decorator'

@WsNamespaceGateway({ namespace: 'wa' })
export class WsHandleClearChat {
  constructor(private handleClearChat: HandleClearChat) {}

  @WsSubscribeEvent<ChatClientEvents>('chat:clear')
  @UsePipes(new ZodWsValidationPipe(chatClearClientPayload))
  async register(
    @MessageBody() payload: ChatClearClientPayload,
    @WsRoom() whatsAppId: string,
  ) {
    const { waChatId } = payload

    await this.handleClearChat.execute({
      waChatId,
      whatsAppId,
    })
  }
}
