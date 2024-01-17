import { Injectable } from '@nestjs/common'
import { WAWebJSService } from '../wa-web-js'
import { HandleWAGenerateQRCode } from '@/domain/chat/application/handlers/handle-wa-generate-qr-code'
import { WAWebJSServiceManager } from '../wa-web-js-manager.service'
import { Events } from 'whatsapp-web.js'
import { WAWebJSEvent, WAWebJSListener } from '../wa-web-js-event'

@Injectable()
export class WAHandleGenerateQrCodeEvent implements WAWebJSEvent {
  constructor(
    private waServiceManager: WAWebJSServiceManager,
    private handleWAGenerateQRCode: HandleWAGenerateQRCode,
  ) {
    this.waServiceManager.addEvent(this)
  }

  name = Events.READY

  listener(waService: WAWebJSService): WAWebJSListener {
    return async (qrCode: string) => {
      await this.handleWAGenerateQRCode.execute({
        qrCode,
        whatsAppId: waService.whatsAppId.toString(),
      })
    }
  }
}
