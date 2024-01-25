import { Module } from '@nestjs/common'

import { WAClientManager } from '@/domain/chat/application/services/wa-client-manager'

import { AdaptersModule } from '@/infra/adapters/adapters.module'
import { EmittersModule } from '@/infra/emitters/emitters.module'

import { WWJSClientManager } from './wwjs-client-manager.service'
import { WWJSClientService } from './wwjs-client.service'

import { HandleWAChangeUnreadCount } from '@/domain/chat/application/handlers/handle-wa-change-chat-unread-count'
import { HandleWAChangeMessageAck } from '@/domain/chat/application/handlers/handle-wa-change-message-ack'
import { HandleWAConnected } from '@/domain/chat/application/handlers/handle-wa-connected'
import { HandleWAConnecting } from '@/domain/chat/application/handlers/handle-wa-connecting'
import { HandleWADisconnected } from '@/domain/chat/application/handlers/handle-wa-disconnected'
import { HandleWAGenerateQRCode } from '@/domain/chat/application/handlers/handle-wa-generate-qr-code'
import { HandleWARevokeMessage } from '@/domain/chat/application/handlers/handle-wa-revoke-message'

import { StorageModule } from '@/infra/storage/storage.module'
import { WWJSHandleDisconnected } from './handlers/wwjs-handle-disconnected'
import { WWJSHandleGenerateQrCode } from './handlers/wwjs-handle-generate-qr-code'
import { WWJSHandleLoadingScreen } from './handlers/wwjs-handle-loading-screen'
import { WWJSHandleMessageAck } from './handlers/wwjs-handle-message-ack'
import { WWJSHandleMessageRevokedEveryone } from './handlers/wwjs-handle-message-revoke-everyone'
import { WWJSHandleReady } from './handlers/wwjs-handle-ready'
import { WWJSHandleUnreadCount } from './handlers/wwjs-handle-unread-count'

@Module({
  imports: [EmittersModule, AdaptersModule, StorageModule],
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
    WWJSHandleMessageAck,
    HandleWAChangeMessageAck,
    WWJSHandleMessageRevokedEveryone,
    HandleWARevokeMessage,
  ],
  exports: [WAClientManager],
})
export class WWJSModule {}
