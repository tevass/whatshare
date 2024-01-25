import { HandleWAReceivedMessage } from '@/domain/chat/application/handlers/handle-wa-received-message'
import { Injectable } from '@nestjs/common'
import WWJS from 'whatsapp-web.js'
import { WWJSClient } from '../clients/wwjs-client'
import { WWJSChatMapper } from '../mappers/wwjs-chat-mapper'
import { WWJSMessageMapper } from '../mappers/wwjs-message-mapper'
import { WWJSClientService } from '../wwjs-client.service'
import { WWJSHandler, WWJSListener } from '../wwjs-handler'

@Injectable()
export class WWJSHandleMessage implements WWJSHandler {
  constructor(
    private wwjsClientService: WWJSClientService,
    private handleWAReceivedMessage: HandleWAReceivedMessage,
  ) {
    this.wwjsClientService.addHandler(this)
  }

  event = WWJS.Events.MESSAGE_ACK

  register(waClient: WWJSClient): WWJSListener {
    return async (message: WWJS.Message) => {
      const rawChat = await message.getChat()
      const waChat = await WWJSChatMapper.toDomain({
        raw: rawChat,
        waClientId: waClient.id,
      })

      const waMessage = await WWJSMessageMapper.toDomain({
        raw: message,
        chatId: waChat.id,
      })

      await this.handleWAReceivedMessage.execute({
        waChat,
        waMessage,
        whatsAppId: waClient.id.toString(),
      })
    }
  }
}
