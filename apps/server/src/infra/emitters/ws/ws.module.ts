import { Module } from '@nestjs/common'
import { WsGateway } from './ws.gateway'
import { WhatsAppEmitter } from '@/domain/chat/application/emitters/whats-app-emitter'
import { WsWhatsAppEmitter } from './whats-app-emitter.'
import { HandleWSConnection } from './handle-connection'

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
