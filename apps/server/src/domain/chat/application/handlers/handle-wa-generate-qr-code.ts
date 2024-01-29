import { Either, left, right } from '@/core/either'
import { WhatsApp } from '@/domain/chat/enterprise/entities/whats-app'
import { ResourceNotFoundError } from '@/domain/shared/application/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { WhatsAppEmitter } from '../emitters/whats-app-emitter'
import { WhatsAppsRepository } from '../repositories/whats-apps-repository'

interface HandleWAGenerateQRCodeRequest {
  whatsAppId: string
  qrCode: string
}

type HandleWAGenerateQRCodeResponse = Either<
  ResourceNotFoundError,
  {
    whatsApp: WhatsApp
  }
>

@Injectable()
export class HandleWAGenerateQRCode {
  constructor(
    private whatsAppsRepository: WhatsAppsRepository,
    private whatsAppEmitter: WhatsAppEmitter,
  ) {}

  async execute(
    request: HandleWAGenerateQRCodeRequest,
  ): Promise<HandleWAGenerateQRCodeResponse> {
    const { qrCode, whatsAppId } = request

    const whatsApp = await this.whatsAppsRepository.findById({ id: whatsAppId })
    if (!whatsApp) {
      return left(new ResourceNotFoundError(whatsAppId))
    }

    whatsApp.set({ qrCode })
    await this.whatsAppsRepository.save(whatsApp)

    this.whatsAppEmitter.emitQrCode({
      whatsApp,
    })

    return right({
      whatsApp,
    })
  }
}
