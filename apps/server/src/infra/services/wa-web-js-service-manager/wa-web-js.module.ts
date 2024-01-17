import { WAServiceManager } from '@/domain/chat/application/services/wa-service-manager'
import { Logger, Module } from '@nestjs/common'
import { WAHandleGenerateQrCodeEvent } from './events/wa-handle-generate-qr-code-event'
import { WAWebJSServiceManager } from './wa-web-js-manager.service'

@Module({
  providers: [
    Logger,
    WAWebJSServiceManager,
    {
      provide: WAServiceManager,
      useExisting: WAWebJSServiceManager,
    },

    // Events
    WAHandleGenerateQrCodeEvent,
  ],
  exports: [WAServiceManager],
})
export class WAWebJSModule {}
