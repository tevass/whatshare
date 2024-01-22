import { HandleWAGenerateQRCode } from '@/domain/chat/application/handlers/handle-wa-generate-qr-code'
import { Injectable } from '@nestjs/common'
import { Events } from 'whatsapp-web.js'
import { WWJSClient } from '../client'
import { WWJSHandler, WWJSListener } from '../handler'
import { WWJSService } from '../wwjs.service'

@Injectable()
export class WWJSHandleGenerateQrCode implements WWJSHandler {
  constructor(
    private wwjsService: WWJSService,
    private handleWAGenerateQRCode: HandleWAGenerateQRCode,
  ) {
    this.wwjsService.addHandler(this)
  }

  event = Events.QR_RECEIVED

  register(waClient: WWJSClient): WWJSListener {
    return async (qrCode: string) => {
      await this.handleWAGenerateQRCode.execute({
        qrCode,
        whatsAppId: waClient.whatsAppId.toString(),
      })
    }
  }
}
