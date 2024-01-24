import { Module } from '@nestjs/common'

import { WsGateway } from './ws.gateway'
import { WSJoinRoomMiddleware } from './ws-join-room-middleware'

import { WhatsAppEmitter } from '@/domain/chat/application/emitters/whats-app-emitter'
import { ChatEmitter } from '@/domain/chat/application/emitters/chat-emitter'

import { WsWhatsAppEmitter } from './emitters/ws-whats-app-emitter'
import { WsChatEmitter } from './emitters/ws-chat-emitter'

@Module({
  providers: [
    WSJoinRoomMiddleware,
    WsGateway,
    {
      provide: WhatsAppEmitter,
      useClass: WsWhatsAppEmitter,
    },
    {
      provide: ChatEmitter,
      useClass: WsChatEmitter,
    },
  ],
  exports: [WhatsAppEmitter, ChatEmitter],
})
export class WsModule {}
