import { Injectable } from '@nestjs/common'
import WWJS from 'whatsapp-web.js'
import { WWJSHandler, WWJSListener } from '../wwjs-handler'
import { WWJSClientService } from '../wwjs-client.service'
import { HandleWAChangeMessageAck } from '@/domain/chat/application/handlers/handle-wa-change-message-ack'
import { WWJSMessageAckMapper } from '../mappers/wwjs-message-ack-mapper'
import { WWJSMessageMapper } from '../mappers/wwjs-message-mapper'

@Injectable()
export class WWJSHandleMessageAck implements WWJSHandler {
  constructor(
    private wwjsClientService: WWJSClientService,
    private handleWAChangeMessageAck: HandleWAChangeMessageAck,
  ) {
    this.wwjsClientService.addHandler(this)
  }

  event = WWJS.Events.MESSAGE_ACK

  register(): WWJSListener {
    return async (message: WWJS.Message, ack: WWJS.MessageAck) => {
      const waMessage = await WWJSMessageMapper.toDomain({ raw: message })

      await this.handleWAChangeMessageAck.execute({
        waMessage,
        ack: WWJSMessageAckMapper.toDomain(ack),
      })
    }
  }
}
