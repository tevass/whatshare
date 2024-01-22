import { HandleWAGenerateQRCode } from '@/domain/chat/application/handlers/handle-wa-generate-qr-code'
import { WAWebJSEvent, WAWebJSListener } from '../wa-web-js-event'
import { WAWebJSService } from '../wa-web-js.service'
import { Events } from 'whatsapp-web.js'
import { WAWebJSClient } from '../wa-web-js-client'
import { Injectable } from '@nestjs/common'

@Injectable()
export class WAHandleGenerateQrCodeEvent implements WAWebJSEvent {
  constructor(
    private waService: WAWebJSService,
    private handleWAGenerateQRCode: HandleWAGenerateQRCode,
  ) {
    this.waService.addEvent(this)
  }

  name = Events.QR_RECEIVED

  listener(waClient: WAWebJSClient): WAWebJSListener {
    return async (qrCode: string) => {
      await this.handleWAGenerateQRCode.execute({
        qrCode,
        whatsAppId: waClient.whatsAppId.toString(),
      })
    }
  }
}
