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
import { WAWebJSEvent } from './wa-web-js-event'
import { WAWebJSService } from './wa-web-js-service'

@Injectable()
export class WAWebJSServiceManager
  implements WAServiceManager, OnModuleInit, OnModuleDestroy
{
  constructor(
    private logger: Logger,
    private env: EnvService,
    private whatsAppsRepository: WhatsAppsRepository,
  ) {}

  private waServices: Map<string, WAWebJSService> = new Map()

  async onModuleInit() {
    const whatsApps = await this.whatsAppsRepository.findAll()

    const waServices = whatsApps.map((whatsApp) =>
      this.createWAWebJSServiceFromWhatsApp(whatsApp),
    )

    Promise.all(waServices.map((waService) => waService.init())).then(() => {
      this.logger.debug('WAServices initialized successfully!')
    })
  }

  async onModuleDestroy() {
    const waServicesArray = Array.from(this.waServices.values())
    await Promise.all(waServicesArray.map((waService) => waService.destroy()))

    this.logger.debug('WAServices disconnected successfully!')
  }

  get(whatsAppId: UniqueEntityID): WAWebJSService | null {
    const waService = this.waServices.get(whatsAppId.toString())
    return waService && waService.isConnected() ? waService : null
  }

  private events: WAWebJSEvent[] = []

  addEvent(event: WAWebJSEvent) {
    this.events.push(event)
  }

  private createWAWebJSServiceFromWhatsApp(whatsApp: WhatsApp) {
    const withoutHeadless = this.env.get('NODE_ENV') === 'production'

    const raw = new Client({
      authStrategy: new LocalAuth({ clientId: whatsApp.id.toString() }),
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

    const waService = WAWebJSService.create({
      raw,
      whatsAppId: whatsApp.id,
    })

    this.waServices.set(whatsApp.id.toString(), waService)
    this.events.forEach((event) => {
      raw.on(event.name, event.listener(waService))
    })

    return waService
  }
}
