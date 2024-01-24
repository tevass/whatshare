import { HandleWAConnecting } from '@/domain/chat/application/handlers/handle-wa-connecting'
import { Injectable } from '@nestjs/common'
import { Events } from 'whatsapp-web.js'
import { WWJSClientService } from '../wwjs-client.service'
import { WWJSClient } from '../clients/wwjs-client'
import { WWJSHandler, WWJSListener } from '../wwjs-handler'

@Injectable()
export class WWJSHandleLoadingScreen implements WWJSHandler {
  constructor(
    private wwjsClientService: WWJSClientService,
    private handleWAConnecting: HandleWAConnecting,
  ) {
    this.wwjsClientService.addHandler(this)
  }

  event = Events.LOADING_SCREEN

  register(waClient: WWJSClient): WWJSListener {
    return async () => {
      await this.handleWAConnecting.execute({
        whatsAppId: waClient.id.toString(),
      })
    }
  }
}
