import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WAService } from '@/domain/chat/application/services/wa-service'
import { EnvService } from '@/infra/env/env.service'
import {
  Injectable,
  LoggerService,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common'
import WAWebJS from 'whatsapp-web.js'
import { WAWebJSClient } from './wa-web-js-client'

import { WhatsAppsRepository } from '@/domain/chat/application/repositories/whats-apps-repository'
import { args as BROWSER_ARGS } from './browser-args.json'

@Injectable()
export class WAWebService implements WAService, OnModuleInit, OnModuleDestroy {
  constructor(
    private env: EnvService,
    private logger: LoggerService,
    private whatsAppsRepository: WhatsAppsRepository,
  ) {}

  private clients: Map<string, WAWebJSClient> = new Map()

  get(waClientId: string): WAWebJSClient | null {
    const client = this.clients.get(waClientId)
    return client && client.isReady ? client : null
  }

  async onModuleInit() {
    const whatsApps = await this.whatsAppsRepository.findAll()
    const clients = whatsApps.map((whatsApp) => this.createClient(whatsApp.id))
    const rawClients = clients.map((client) => client.switchToRaw())

    Promise.all(rawClients.map((raw) => raw.initialize())).then(() => {
      this.logger.log('Clients connected!')
    })
  }

  async onModuleDestroy() {
    const clients = Array.from(this.clients.values())
    const rawClients = clients.map((client) => client.switchToRaw())

    await Promise.all(rawClients.map((raw) => raw.destroy()))
  }

  private createClient(id: UniqueEntityID) {
    const withoutHeadless = this.env.get('NODE_ENV') !== 'production'

    const rawClient = new WAWebJS.Client({
      authStrategy: new WAWebJS.LocalAuth({ clientId: id.toString() }),
      puppeteer: {
        args: BROWSER_ARGS,
        executablePath: this.env.get('WA_WEB_JS_EXECUTABLE_PATH'),
        headless: withoutHeadless,
      },
      webVersion: this.env.get('WA_WEB_JS_WEB_VERSION'),
      webVersionCache: {
        type: 'remote',
        remotePath: this.env.get('WA_WEB_JS_REMOTE_PATH'),
      },
    })

    return WAWebJSClient.create(rawClient, id)
  }
}
