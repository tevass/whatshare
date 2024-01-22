import { WhatsAppEmitter } from '@/domain/chat/application/emitters/whats-app-emitter'
import { Module } from '@nestjs/common'
import { WsWhatsAppEmitter } from './emitters/ws-whats-app-emitter'
import { HandleWSConnection } from './handle-connection'
import { WsGateway } from './ws.gateway'

@Module({
  providers: [
    HandleWSConnection,
    WsGateway,
    {
      provide: WhatsAppEmitter,
      useClass: WsWhatsAppEmitter,
    },
  ],
  exports: [WhatsAppEmitter],
})
export class WsModule {}
