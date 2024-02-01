import { Injectable } from '@nestjs/common'
import WWJS from 'whatsapp-web.js'
import { HandleWADisconnected } from '@/domain/chat/application/handlers/handle-wa-disconnected'
import { WWJSHandler, WWJSListener } from '../wwjs-handler'
import { WWJSClientService } from '../wwjs-client.service'
import { WWJSClient } from '../clients/wwjs-client'

@Injectable()
export class WWJSHandleDisconnected implements WWJSHandler {
  constructor(
    private wwjsClientService: WWJSClientService,
    private handleWADisconnected: HandleWADisconnected,
  ) {
    this.wwjsClientService.addHandler(this)
  }

  event = WWJS.Events.DISCONNECTED

  register(wwjsClient: WWJSClient): WWJSListener {
    return async () => {
      await this.handleWADisconnected.execute({
        whatsAppId: wwjsClient.id.toString(),
      })
    }
  }
}
