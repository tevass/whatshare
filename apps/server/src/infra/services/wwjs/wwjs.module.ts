import { HandleWAConnected } from '@/domain/chat/application/handlers/handle-wa-connected'
import { HandleWAConnecting } from '@/domain/chat/application/handlers/handle-wa-connecting'
import { HandleWADisconnected } from '@/domain/chat/application/handlers/handle-wa-disconnected'
import { HandleWAGenerateQRCode } from '@/domain/chat/application/handlers/handle-wa-generate-qr-code'
import { EmittersModule } from '@/infra/emitters/emitters.module'
import { Module } from '@nestjs/common'
import { WWJSHandleDisconnected } from './handlers/wwjs-handle-disconnected'
import { WWJSHandleGenerateQrCode } from './handlers/wwjs-handle-generate-qr-code'
import { WWJSHandleLoadingScreen } from './handlers/wwjs-handle-loading-screen'
import { WWJSHandleReady } from './handlers/wwjs-handle-ready'
import { WWJSClientService } from './wwjs-client.service'
import { WWJSClientManager } from './wwjs-client-manager.service'
import { WAClientManager } from '@/domain/chat/application/services/wa-client-manager'
import { WWJSHandleUnreadCount } from './handlers/wwjs-handle-unread-count'
import { HandleWAChangeUnreadCount } from '@/domain/chat/application/handlers/handle-wa-change-chat-unread-count'

@Module({
  imports: [EmittersModule],
  providers: [
    WWJSClientService,
    WWJSClientManager,
    {
      provide: WAClientManager,
      useExisting: WWJSClientManager,
    },

    WWJSHandleGenerateQrCode,
    HandleWAGenerateQRCode,
    WWJSHandleReady,
    HandleWAConnected,
    WWJSHandleDisconnected,
    HandleWADisconnected,
    WWJSHandleLoadingScreen,
    HandleWAConnecting,
    WWJSHandleUnreadCount,
    HandleWAChangeUnreadCount,
  ],
  exports: [WAClientManager],
})
export class WWJSModule {}
