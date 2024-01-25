import { Injectable } from '@nestjs/common'
import WWJS from 'whatsapp-web.js'
import { WWJSHandler, WWJSListener } from '../wwjs-handler'
import { WWJSClientService } from '../wwjs-client.service'
import { WWJSMessageMapper } from '../mappers/wwjs-message-mapper'
import { HandleWARevokeMessage } from '@/domain/chat/application/handlers/handle-wa-revoke-message'
import { WWJSClient } from '../clients/wwjs-client'
import { WAEntityID } from '@/core/entities/wa-entity-id'

@Injectable()
export class WWJSHandleMessageRevokedEveryone implements WWJSHandler {
  constructor(
    private wwjsClientService: WWJSClientService,
    private handleWARevokeMessage: HandleWARevokeMessage,
  ) {
    this.wwjsClientService.addHandler(this)
  }

  event = WWJS.Events.MESSAGE_REVOKED_EVERYONE

  register(waClient: WWJSClient): WWJSListener {
    return async (_: WWJS.Message, revokedMessage?: WWJS.Message) => {
      if (!revokedMessage) return

      const chat = await revokedMessage.getChat()
      const waChatId = WAEntityID.createFromString(chat.id._serialized)

      const waRevokedMessage = await WWJSMessageMapper.toDomain({
        raw: revokedMessage,
        chatId: waChatId,
      })

      await this.handleWARevokeMessage.execute({
        waRevokedMessage,
        waChatId,
        whatsAppId: waClient.id.toString(),
      })
    }
  }
}
