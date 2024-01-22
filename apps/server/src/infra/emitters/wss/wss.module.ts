import { WhatsAppEmitter } from '@/domain/chat/application/emitters/whats-app-emitter'
import { Module } from '@nestjs/common'
import { WssWhatsAppEmitter } from './whats-app/whats-app-emitter.gateway'

@Module({
  providers: [
    WssWhatsAppEmitter,
    {
      provide: WhatsAppEmitter,
      useClass: WssWhatsAppEmitter,
    },
  ],
  exports: [WhatsAppEmitter],
})
export class WssModule {}
