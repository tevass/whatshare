import { WAServiceManager } from '@/domain/chat/application/services/wa-service-manager'
import { Logger, Module } from '@nestjs/common'
import { WAHandleGenerateQrCodeEvent } from './events/wa-handle-generate-qr-code-event'
import { WAWebJSService } from './wa-web-js.service'
import { EmittersModule } from '@/infra/emitters/emitters.module'

@Module({
  imports: [EmittersModule],
  providers: [
    Logger,
    WAWebJSService,
    {
      provide: WAServiceManager,
      useExisting: WAWebJSService,
    },

    // Events
    WAHandleGenerateQrCodeEvent,
  ],
  exports: [WAServiceManager],
})
export class WAWebJSModule {}
