import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WhatsAppsRepository } from '@/domain/chat/application/repositories/whats-apps-repository'
import { WAServiceManager } from '@/domain/chat/application/services/wa-service-manager'
import { WhatsApp } from '@/domain/chat/enterprise/entities/whats-app'
import { EnvService } from '@/infra/env/env.service'
import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common'
import { Client, LocalAuth } from 'whatsapp-web.js'
import { args as BROWSER_ARGS } from './browser-args.json'
import { WWJSClient } from './client'
import { WWJSHandler } from './handler'

@Injectable()
export class WWJSService
  implements WAServiceManager, OnModuleInit, OnModuleDestroy
{
  constructor(
    private logger: Logger,
    private env: EnvService,
    private whatsAppsRepository: WhatsAppsRepository,
  ) {}

  private waServices: Map<string, WWJSClient> = new Map()

  get(whatsAppId: UniqueEntityID): WWJSClient | null {
    const waService = this.waServices.get(whatsAppId.toString())
    return waService && waService.isConnected() ? waService : null
  }

  async onModuleInit() {
    const whatsApps = await this.whatsAppsRepository.findAll()

    const waServices = whatsApps.map((whatsApp) =>
      this.createWWJSServiceFromWhatsApp(whatsApp),
    )

    Promise.all(waServices.map((waService) => waService.init())).then(() => {
      this.logger.debug('WAServices initialized successfully!')
    })
  }

  async onModuleDestroy() {
    const waServicesArray = Array.from(this.waServices.values())
    await Promise.all(waServicesArray.map((waService) => waService.close()))

    this.logger.debug('WAServices disconnected successfully!')
  }

  private handlers: WWJSHandler[] = []

  addHandler(handler: WWJSHandler) {
    this.handlers.push(handler)
  }

  createWWJSServiceFromWhatsApp(whatsApp: WhatsApp) {
    const withoutHeadless = this.env.get('NODE_ENV') === 'production'

    const raw = new Client({
      authStrategy: new LocalAuth({ clientId: whatsApp.id.toString() }),
      puppeteer: {
        args: BROWSER_ARGS,
        executablePath: this.env.get('WWJS_EXECUTABLE_PATH'),
        headless: withoutHeadless,
      },
      webVersion: this.env.get('WWJS_WEB_VERSION'),
      webVersionCache: {
        type: 'remote',
        remotePath: this.env.get('WWJS_REMOTE_PATH'),
      },
    })

    const waService = WWJSClient.create({
      raw,
      whatsAppId: whatsApp.id,
    })

    this.waServices.set(whatsApp.id.toString(), waService)
    this.handlers.forEach((handler) => {
      raw.on(handler.event, handler.register(waService))
    })

    return waService
  }
}
