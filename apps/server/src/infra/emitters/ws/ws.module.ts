import { Module } from '@nestjs/common'

import { WSAuthCookieMiddleware } from './ws-auth-cookie-middleware'
import { WSJoinRoomMiddleware } from './ws-join-room-middleware'
import { WsGateway } from './ws.gateway'

import { ChatEmitter } from '@/domain/chat/application/emitters/chat-emitter'
import { MessageEmitter } from '@/domain/chat/application/emitters/message-emitter'
import { WhatsAppEmitter } from '@/domain/chat/application/emitters/whats-app-emitter'

import { WsChatEmitter } from './emitters/ws-chat-emitter'
import { WsMessageEmitter } from './emitters/ws-message-emitter'
import { WsWhatsAppEmitter } from './emitters/ws-whats-app-emitter'

import { WsHandleClearChat } from './handlers/ws-handle-clear-chat'
import { WsHandleReadChat } from './handlers/ws-handle-read-chat'
import { WsHandleSendTextMessage } from './handlers/ws-handle-send-text-message'
import { WsHandleUnreadChat } from './handlers/ws-handle-unread-chat'

import { HandleClearChat } from '@/domain/chat/application/handlers/handle-clear-chat'
import { HandleReadChat } from '@/domain/chat/application/handlers/handle-read-chat'
import { HandleSendTextMessage } from '@/domain/chat/application/handlers/handle-send-text-message'
import { HandleUnreadChat } from '@/domain/chat/application/handlers/handle-unread-chat'
import { StorageModule } from '@/infra/storage/storage.module'
import { CreateChatFromWaChatUseCase } from '@/domain/chat/application/use-cases/chats/create-chat-from-wa-chat-use-case'
import { CreateContactsFromWaContactsUseCase } from '@/domain/chat/application/use-cases/contacts/create-contacts-from-wa-contacts-use-case'

@Module({
  imports: [StorageModule],
  providers: [
    WSAuthCookieMiddleware,
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
    WsHandleSendTextMessage,
    HandleSendTextMessage,
    CreateChatFromWaChatUseCase,
    CreateContactsFromWaContactsUseCase,
    WsHandleUnreadChat,
    HandleUnreadChat,
  ],
  exports: [WhatsAppEmitter, ChatEmitter, MessageEmitter],
})
export class WsModule {}
