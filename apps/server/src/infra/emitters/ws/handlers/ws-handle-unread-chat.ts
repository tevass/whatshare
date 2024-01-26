import { HandleUnreadChat } from '@/domain/chat/application/handlers/handle-unread-chat'
import { WsNamespaceGateway } from '../decorators/ws-namespace-gateway.decorator'
import { WsSubscribeEvent } from '../decorators/ws-subscribe-event.decorator'
import {
  ChatClientEvents,
  ChatUnreadClientPayload,
  chatUnreadClientPayload,
} from '@whatshare/ws-schemas/events'
import { MessageBody } from '@nestjs/websockets'
import { UsePipes } from '@nestjs/common'
import { ZodWsValidationPipe } from '../pipes/zod-ws-validation-pipe'
import { WsRoom } from '../decorators/ws-room.decorator'

@WsNamespaceGateway({ namespace: 'wa' })
export class WsHandleUnreadChat {
  constructor(private handleUnreadChat: HandleUnreadChat) {}

  @WsSubscribeEvent<ChatClientEvents>('chat:unread')
  @UsePipes(new ZodWsValidationPipe(chatUnreadClientPayload))
  async register(
    @MessageBody() payload: ChatUnreadClientPayload,
    @WsRoom() whatsAppId: string,
  ) {
    const { waChatId } = payload

    await this.handleUnreadChat.execute({
      waChatId,
      whatsAppId,
    })
  }
}
