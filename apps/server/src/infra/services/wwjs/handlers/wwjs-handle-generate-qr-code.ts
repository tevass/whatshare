import { HandleWAGenerateQRCode } from '@/domain/chat/application/handlers/handle-wa-generate-qr-code'
import { Injectable } from '@nestjs/common'
import WWJS from 'whatsapp-web.js'
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

  event = WWJS.Events.QR_RECEIVED

  register(wwjsClient: WWJSClient): WWJSListener {
    return async (qrCode: string) => {
      await this.handleWAGenerateQRCode.execute({
        qrCode,
        whatsAppId: wwjsClient.id.toString(),
      })
    }
  }
}
