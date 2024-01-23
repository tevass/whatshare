import { HandleWAGenerateQRCode } from '@/domain/chat/application/handlers/handle-wa-generate-qr-code'
import { WAServiceManager } from '@/domain/chat/application/services/wa-service-manager'
import { EmittersModule } from '@/infra/emitters/emitters.module'
import { Logger, Module } from '@nestjs/common'
import { WWJSHandleGenerateQrCode } from './handlers/wwjs-handle-generate-qr-code'
import { WWJSService } from './wwjs.service'
import { WWJSHandleReady } from './handlers/wwjs-handle-ready'
import { HandleWAConnected } from '@/domain/chat/application/handlers/handle-wa-connected'
import { WWJSHandleDisconnected } from './handlers/wwjs-handle-disconnected'
import { HandleWADisconnected } from '@/domain/chat/application/handlers/handle-wa-disconnected'

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
    WWJSHandleReady,
    HandleWAConnected,
    WWJSHandleDisconnected,
    HandleWADisconnected,
  ],
  exports: [WAServiceManager],
})
export class WWJSModule {}
