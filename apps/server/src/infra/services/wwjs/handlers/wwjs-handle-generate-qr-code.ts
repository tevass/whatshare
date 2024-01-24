import { HandleWAGenerateQRCode } from '@/domain/chat/application/handlers/handle-wa-generate-qr-code'
import { Injectable } from '@nestjs/common'
import { Events } from 'whatsapp-web.js'
import { WWJSHandler, WWJSListener } from '../wwjs-handler'
import { WWJSClientService } from '../wwjs-client.service'
import { WWJSClient } from '../clients/wwjs-client'

@Injectable()
export class WWJSHandleGenerateQrCode implements WWJSHandler {
  constructor(
    private wwjsClientService: WWJSClientService,
    private handleWAGenerateQRCode: HandleWAGenerateQRCode,
  ) {
    this.wwjsClientService.addHandler(this)
  }

  event = Events.QR_RECEIVED

  register(waClient: WWJSClient): WWJSListener {
    return async (qrCode: string) => {
      await this.handleWAGenerateQRCode.execute({
        qrCode,
        whatsAppId: waClient.id.toString(),
      })
    }
  }
}
