import { HandleWAConnecting } from '@/domain/chat/application/handlers/handle-wa-connecting'
import { Injectable } from '@nestjs/common'
import { Events } from 'whatsapp-web.js'
import { WWJSClient } from '../client'
import { WWJSHandler, WWJSListener } from '../handler'
import { WWJSService } from '../wwjs.service'

@Injectable()
export class WWJSHandleLoadingScreen implements WWJSHandler {
  constructor(
    private wwjsService: WWJSService,
    private handleWAConnecting: HandleWAConnecting,
  ) {
    this.wwjsService.addHandler(this)
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
