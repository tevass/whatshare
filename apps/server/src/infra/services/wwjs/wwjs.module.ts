import { HandleWAGenerateQRCode } from '@/domain/chat/application/handlers/handle-wa-generate-qr-code'
import { WAServiceManager } from '@/domain/chat/application/services/wa-service-manager'
import { EmittersModule } from '@/infra/emitters/emitters.module'
import { Logger, Module } from '@nestjs/common'
import { WWJSHandleGenerateQrCode } from './handlers/wwjs-handle-generate-qr-code'
import { WWJSService } from './wwjs.service'

@Module({
  imports: [EmittersModule],
  providers: [
    Logger,
    WWJSService,
    {
      provide: WAServiceManager,
      useExisting: WWJSService,
    },

    WWJSHandleGenerateQrCode,
    HandleWAGenerateQRCode,
  ],
  exports: [WAServiceManager],
})
export class WWJSModule {}
