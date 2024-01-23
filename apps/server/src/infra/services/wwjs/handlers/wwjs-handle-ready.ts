import { Injectable } from '@nestjs/common'
import { Events } from 'whatsapp-web.js'
import { WWJSClient } from '../client'
import { WWJSHandler, WWJSListener } from '../handler'
import { WWJSService } from '../wwjs.service'
import { HandleWAConnected } from '@/domain/chat/application/handlers/handle-wa-connected'

@Injectable()
export class WWJSHandleReady implements WWJSHandler {
  constructor(
    private wwjsService: WWJSService,
    private handleWAConnected: HandleWAConnected,
  ) {
    this.wwjsService.addHandler(this)
  }

  event = Events.READY

  register(waClient: WWJSClient): WWJSListener {
    return async () => {
      await this.handleWAConnected.execute({
        whatsAppId: waClient.id.toString(),
      })
    }
  }
}
