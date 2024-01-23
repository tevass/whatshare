import { Either, left, right } from '@/core/either'
import { WhatsApp } from '@/domain/chat/enterprise/entities/whats-app'
import { ResourceNotFoundError } from '@/domain/shared/application/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { WhatsAppEmitter } from '../emitters/whats-app-emitter'
import { WhatsAppsRepository } from '../repositories/whats-apps-repository'
import { WAServiceManager } from '../services/wa-service-manager'

interface HandleWAConnectingRequest {
  whatsAppId: string
}

type HandleWAConnectingResponse = Either<
  ResourceNotFoundError,
  {
    whatsApp: WhatsApp
  }
>

@Injectable()
export class HandleWAConnecting {
  constructor(
    private whatsAppsRepository: WhatsAppsRepository,
    private whatsAppEmitter: WhatsAppEmitter,
    private waManager: WAServiceManager,
  ) {}

  async execute(
    request: HandleWAConnectingRequest,
  ): Promise<HandleWAConnectingResponse> {
    const { whatsAppId } = request

    const whatsApp = await this.whatsAppsRepository.findById(whatsAppId)
    if (!whatsApp) {
      return left(new ResourceNotFoundError(whatsAppId))
    }

    whatsApp.set({ status: 'connecting' })
    await this.whatsAppsRepository.save(whatsApp)
    this.waManager.updateFromWhatsApp(whatsApp)

    this.whatsAppEmitter.emitChange({
      whatsApp,
    })

    return right({
      whatsApp,
    })
  }
}
