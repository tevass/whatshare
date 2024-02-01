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
import { HandleWAReceivedMessage } from '@/domain/chat/application/handlers/handle-wa-received-message'

import { StorageModule } from '@/infra/storage/storage.module'
import { WWJSHandleDisconnected } from './handlers/wwjs-handle-disconnected'
import { WWJSHandleGenerateQrCode } from './handlers/wwjs-handle-generate-qr-code'
import { WWJSHandleLoadingScreen } from './handlers/wwjs-handle-loading-screen'
import { WWJSHandleMessageAck } from './handlers/wwjs-handle-message-ack'
import { WWJSHandleMessageRevokedEveryone } from './handlers/wwjs-handle-message-revoke-everyone'
import { WWJSHandleReady } from './handlers/wwjs-handle-ready'
import { WWJSHandleUnreadCount } from './handlers/wwjs-handle-unread-count'
import { WWJSHandleMessageReceived } from './handlers/wwjs-handle-message-received'
import { CreateMessageFromWAMessageUseCase } from '@/domain/chat/application/use-cases/messages/create-message-from-wa-message-use-case'
import { CreateContactsFromWaContactsUseCase } from '@/domain/chat/application/use-cases/contacts/create-contacts-from-wa-contacts-use-case'
import { CreateChatFromWaChatUseCase } from '@/domain/chat/application/use-cases/chats/create-chat-from-wa-chat-use-case'

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
    WWJSHandleMessageReceived,
    HandleWAReceivedMessage,
    CreateChatFromWaChatUseCase,
    CreateMessageFromWAMessageUseCase,
    CreateContactsFromWaContactsUseCase,
  ],
  exports: [WAClientManager],
})
export class WWJSModule {}
