import { HandleReadChat } from '@/domain/chat/application/handlers/handle-read-chat'
import { WsNamespaceGateway } from '../decorators/ws-namespace-gateway.decorator'
import { WsSubscribeEvent } from '../decorators/ws-subscribe-event.decorator'
import {
  ChatClientEvents,
  ChatReadClientPayload,
  chatReadClientPayload,
} from '@whatshare/ws-schemas/events'
import { MessageBody } from '@nestjs/websockets'
import { UsePipes } from '@nestjs/common'
import { ZodWsValidationPipe } from '../pipes/zod-ws-validation-pipe'
import { WsRoom } from '../decorators/ws-room.decorator'

@WsNamespaceGateway({ namespace: 'wa' })
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
