import { HandleWAConnected } from '@/domain/chat/application/handlers/handle-wa-connected'
import { HandleWAConnecting } from '@/domain/chat/application/handlers/handle-wa-connecting'
import { HandleWADisconnected } from '@/domain/chat/application/handlers/handle-wa-disconnected'
import { HandleWAGenerateQRCode } from '@/domain/chat/application/handlers/handle-wa-generate-qr-code'
import { WAServiceManager } from '@/domain/chat/application/services/wa-service-manager'
import { EmittersModule } from '@/infra/emitters/emitters.module'
import { Logger, Module } from '@nestjs/common'
import { WWJSHandleDisconnected } from './handlers/wwjs-handle-disconnected'
import { WWJSHandleGenerateQrCode } from './handlers/wwjs-handle-generate-qr-code'
import { WWJSHandleLoadingScreen } from './handlers/wwjs-handle-loading-screen'
import { WWJSHandleReady } from './handlers/wwjs-handle-ready'
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
    WWJSHandleReady,
    HandleWAConnected,
    WWJSHandleDisconnected,
    HandleWADisconnected,
    WWJSHandleLoadingScreen,
    HandleWAConnecting,
  ],
  exports: [WAServiceManager],
})
export class WWJSModule {}
