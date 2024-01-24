import { WhatsAppEmitter } from '@/domain/chat/application/emitters/whats-app-emitter'
import { Module } from '@nestjs/common'
import { WsWhatsAppEmitter } from './emitters/ws-whats-app-emitter'
import { WsGateway } from './ws.gateway'
import { WSJoinRoomMiddleware } from './ws-join-room-middleware'

@Module({
  providers: [
    WSJoinRoomMiddleware,
    WsGateway,
    {
      provide: WhatsAppEmitter,
      useClass: WsWhatsAppEmitter,
    },
  ],
  exports: [WhatsAppEmitter],
})
export class WsModule {}
