import { Either, left, right } from '@/core/either'
import { WhatsApp } from '@/domain/chat/enterprise/entities/whats-app'
import { ResourceNotFoundError } from '@/domain/shared/application/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { WhatsAppEmitter } from '../emitters/whats-app-emitter'
import { WhatsAppsRepository } from '../repositories/whats-apps-repository'
import { WAServiceManager } from '../services/wa-service-manager'
import { WAServiceNotFoundError } from './errors/wa-service-not-found-error'

interface HandleWAConnectedRequest {
  whatsAppId: string
}

type HandleWAConnectedResponse = Either<
  ResourceNotFoundError | WAServiceNotFoundError,
  {
    whatsApp: WhatsApp
  }
>

@Injectable()
export class HandleWAConnected {
  constructor(
    private whatsAppsRepository: WhatsAppsRepository,
    private whatsAppEmitter: WhatsAppEmitter,
    private waManager: WAServiceManager,
  ) {}

  async execute(
    request: HandleWAConnectedRequest,
  ): Promise<HandleWAConnectedResponse> {
    const { whatsAppId } = request

    const whatsApp = await this.whatsAppsRepository.findById(whatsAppId)
    if (!whatsApp) {
      return left(new ResourceNotFoundError(whatsAppId))
    }

    whatsApp.connect()
    await this.whatsAppsRepository.save(whatsApp)
    this.waManager.updateFromWhatsApp(whatsApp)

    this.whatsAppEmitter.emitConnected({
      whatsApp,
    })

    return right({
      whatsApp,
    })
  }
}
