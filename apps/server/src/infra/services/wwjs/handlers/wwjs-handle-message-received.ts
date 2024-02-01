import { HandleWAReceivedMessage } from '@/domain/chat/application/handlers/handle-wa-received-message'
import { Injectable } from '@nestjs/common'
import WWJS from 'whatsapp-web.js'
import { WWJSClient } from '../clients/wwjs-client'
import { WWJSChatMapper } from '../mappers/wwjs-chat-mapper'
import { WWJSMessageMapper } from '../mappers/wwjs-message-mapper'
import { WWJSClientService } from '../wwjs-client.service'
import { WWJSHandler, WWJSListener } from '../wwjs-handler'
import { messageType } from '@whatshare/core-schemas/enums'
import { WWJSMessageTypeMapper } from '../mappers/wwjs-message-type-mapper'

const MESSAGE_TYPES = messageType.Enum

@Injectable()
export class WWJSHandleMessageReceived implements WWJSHandler {
  constructor(
    private wwjsClientService: WWJSClientService,
    private handleWAReceivedMessage: HandleWAReceivedMessage,
  ) {
    this.wwjsClientService.addHandler(this)
  }

  event = WWJS.Events.MESSAGE_RECEIVED

  register(wwjsClient: WWJSClient): WWJSListener {
    return async (message: WWJS.Message) => {
      const isValidMessageType =
        WWJSMessageTypeMapper.toDomain(message.type) in MESSAGE_TYPES

      if (!isValidMessageType) return

      const rawChat = await message.getChat()
      const waChat = await WWJSChatMapper.toDomain({
        raw: rawChat,
        waClientId: wwjsClient.id,
        client: wwjsClient.switchToRaw(),
      })

      const waMessage = await WWJSMessageMapper.toDomain({
        raw: message,
        chatId: waChat.id,
      })

      await this.handleWAReceivedMessage.execute({
        waChat,
        waMessage,
        whatsAppId: wwjsClient.id.toString(),
      })
    }
  }
}
