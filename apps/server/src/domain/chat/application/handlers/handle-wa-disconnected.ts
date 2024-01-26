import { Either, left, right } from '@/core/either'
import { WhatsApp } from '@/domain/chat/enterprise/entities/whats-app'
import { ResourceNotFoundError } from '@/domain/shared/application/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { WhatsAppEmitter } from '../emitters/whats-app-emitter'
import { WhatsAppsRepository } from '../repositories/whats-apps-repository'
import { WAClientManager } from '../services/wa-client-manager'

interface HandleWADisconnectedRequest {
  whatsAppId: string
}

type HandleWADisconnectedResponse = Either<
  ResourceNotFoundError,
  {
    whatsApp: WhatsApp
  }
>

@Injectable()
export class HandleWADisconnected {
  constructor(
    private whatsAppsRepository: WhatsAppsRepository,
    private whatsAppEmitter: WhatsAppEmitter,
    private waManager: WAClientManager,
  ) {}

  async execute(
    request: HandleWADisconnectedRequest,
  ): Promise<HandleWADisconnectedResponse> {
    const { whatsAppId } = request

    const whatsApp = await this.whatsAppsRepository.findById(whatsAppId)
    if (!whatsApp) {
      return left(new ResourceNotFoundError(whatsAppId))
    }

    whatsApp.disconnect()
    await this.whatsAppsRepository.save(whatsApp)
    this.waManager.setClientFromWhatsApp(whatsApp)

    this.whatsAppEmitter.emitDisconnected({
      whatsApp,
    })

    return right({
      whatsApp,
    })
  }
}
