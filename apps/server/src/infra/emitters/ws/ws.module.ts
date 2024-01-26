import { Module } from '@nestjs/common'

import { WsGateway } from './ws.gateway'
import { WSJoinRoomMiddleware } from './ws-join-room-middleware'

import { MessageEmitter } from '@/domain/chat/application/emitters/message-emitter'
import { WhatsAppEmitter } from '@/domain/chat/application/emitters/whats-app-emitter'
import { ChatEmitter } from '@/domain/chat/application/emitters/chat-emitter'

import { WsWhatsAppEmitter } from './emitters/ws-whats-app-emitter'
import { WsChatEmitter } from './emitters/ws-chat-emitter'
import { WsMessageEmitter } from './emitters/ws-message-emitter'

import { WsHandleReadChat } from './handlers/ws-handle-read-chat'
import { WsHandleClearChat } from './handlers/ws-handle-clear-chat'

import { HandleClearChat } from '@/domain/chat/application/handlers/handle-clear-chat'
import { HandleReadChat } from '@/domain/chat/application/handlers/handle-read-chat'

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
    {
      provide: MessageEmitter,
      useClass: WsMessageEmitter,
    },

    WsHandleClearChat,
    HandleClearChat,
    WsHandleReadChat,
    HandleReadChat,
  ],
  exports: [WhatsAppEmitter, ChatEmitter, MessageEmitter],
})
export class WsModule {}
