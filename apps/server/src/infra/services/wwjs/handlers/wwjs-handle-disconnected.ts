import { Injectable } from '@nestjs/common'
import { Events } from 'whatsapp-web.js'
import { WWJSClient } from '../client'
import { WWJSHandler, WWJSListener } from '../handler'
import { WWJSService } from '../wwjs.service'
import { HandleWADisconnected } from '@/domain/chat/application/handlers/handle-wa-disconnected'

@Injectable()
export class WWJSHandleDisconnected implements WWJSHandler {
  constructor(
    private wwjsService: WWJSService,
    private handleWADisconnected: HandleWADisconnected,
  ) {
    this.wwjsService.addHandler(this)
  }

  event = Events.DISCONNECTED

  register(waClient: WWJSClient): WWJSListener {
    return async () => {
      await this.handleWADisconnected.execute({
        whatsAppId: waClient.id.toString(),
      })
    }
  }
}
