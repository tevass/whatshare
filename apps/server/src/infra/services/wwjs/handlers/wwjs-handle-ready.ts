import { Injectable } from '@nestjs/common'
import WWJS from 'whatsapp-web.js'
import { HandleWAConnected } from '@/domain/chat/application/handlers/handle-wa-connected'
import { WWJSHandler, WWJSListener } from '../wwjs-handler'
import { WWJSClientService } from '../wwjs-client.service'
import { WWJSClient } from '../clients/wwjs-client'

@Injectable()
export class WWJSHandleReady implements WWJSHandler {
  constructor(
    private wwjsClientService: WWJSClientService,
    private handleWAConnected: HandleWAConnected,
  ) {
    this.wwjsClientService.addHandler(this)
  }

  event = WWJS.Events.READY

  register(waClient: WWJSClient): WWJSListener {
    return async () => {
      await this.handleWAConnected.execute({
        whatsAppId: waClient.id.toString(),
      })
    }
  }
}
