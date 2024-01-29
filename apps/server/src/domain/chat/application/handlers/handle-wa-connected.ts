import { Either, left, right } from '@/core/either'
import { WhatsApp } from '@/domain/chat/enterprise/entities/whats-app'
import { ResourceNotFoundError } from '@/domain/shared/application/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { WhatsAppEmitter } from '../emitters/whats-app-emitter'
import { WhatsAppsRepository } from '../repositories/whats-apps-repository'
import { WAClientManager } from '../services/wa-client-manager'
import { WAClientNotFoundError } from './errors/wa-client-not-found-error'

interface HandleWAConnectedRequest {
  whatsAppId: string
}

type HandleWAConnectedResponse = Either<
  ResourceNotFoundError | WAClientNotFoundError,
  {
    whatsApp: WhatsApp
  }
>

@Injectable()
export class HandleWAConnected {
  constructor(
    private whatsAppsRepository: WhatsAppsRepository,
    private whatsAppEmitter: WhatsAppEmitter,
    private waManager: WAClientManager,
  ) {}

  async execute(
    request: HandleWAConnectedRequest,
  ): Promise<HandleWAConnectedResponse> {
    const { whatsAppId } = request

    const whatsApp = await this.whatsAppsRepository.findById({ id: whatsAppId })
    if (!whatsApp) {
      return left(new ResourceNotFoundError(whatsAppId))
    }

    whatsApp.connect()
    await this.whatsAppsRepository.save(whatsApp)
    this.waManager.setClientFromWhatsApp(whatsApp)

    this.whatsAppEmitter.emitConnected({
      whatsApp,
    })

    return right({
      whatsApp,
    })
  }
}
