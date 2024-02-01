import { Injectable } from '@nestjs/common'
import WWJS from 'whatsapp-web.js'
import { WWJSHandler, WWJSListener } from '../wwjs-handler'
import { WWJSClientService } from '../wwjs-client.service'
import { WWJSClient } from '../clients/wwjs-client'
import { HandleWAChangeUnreadCount } from '@/domain/chat/application/handlers/handle-wa-change-chat-unread-count'
import { WWJSChatMapper } from '../mappers/wwjs-chat-mapper'

/**
 * Open issue about the types of the Events enum.
 *
 * `[WORKAROUND]` Add manually `unread_count` in `Events` enum
 */
declare module 'whatsapp-web.js' {
  enum Events {
    UNREAD_COUNT = 'unread_count',
  }
}

@Injectable()
export class WWJSHandleUnreadCount implements WWJSHandler {
  constructor(
    private wwjsClientService: WWJSClientService,
    private handleWAChangeUnreadCount: HandleWAChangeUnreadCount,
  ) {
    this.wwjsClientService.addHandler(this)
  }

  event = WWJS.Events.UNREAD_COUNT

  register(wwjsClient: WWJSClient): WWJSListener {
    return async (chat: WWJS.Chat) => {
      const waChat = await WWJSChatMapper.toDomain({
        raw: chat,
        waClientId: wwjsClient.id,
        client: wwjsClient.switchToRaw(),
      })

      await this.handleWAChangeUnreadCount.execute({
        waChat,
        whatsAppId: wwjsClient.id.toString(),
      })
    }
  }
}
