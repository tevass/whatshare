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

  async onModuleInit() {
    const whatsApps = await this.whatsAppsRepository.findAll()

    const wwjsClients = whatsApps.map((whatsApp) =>
      this.createWWJSClient(whatsApp),
    )

    Promise.all(wwjsClients.map((waService) => waService.init())).then(() => {
      this.logger.debug('WWJSClients initialized successfully!')
    })
  }

  wwjsClients: Map<string, WWJSClient> = new Map()

  private createWWJSClient(whatsApp: WhatsApp) {
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

    const wwjsClient = WWJSClient.create(
      {
        raw,
        name: whatsApp.name,
        qrCode: whatsApp.qrCode,
        status: whatsApp.status,
      },
      whatsApp.id,
    )

    this.wwjsClients.set(whatsApp.id.toString(), wwjsClient)
    this.handlers.forEach((handler) => {
      raw.on(handler.event, handler.register(wwjsClient))
    })

    return wwjsClient
  }

  get(whatsAppId: UniqueEntityID): WWJSClient | null {
    const waService = this.wwjsClients.get(whatsAppId.toString())
    return waService && waService.isConnected() ? waService : null
  }

  updateFromWhatsApp(whatsApp: WhatsApp): void {
    const wwjsClient = this.wwjsClients.get(whatsApp.id.toString())
    if (!wwjsClient) return

    wwjsClient.setFromWhatsApp(whatsApp)
  }

  private handlers: WWJSHandler[] = []

  addHandler(handler: WWJSHandler) {
    this.handlers.push(handler)
  }

  async onModuleDestroy() {
    const wwjsClientsArray = Array.from(this.wwjsClients.values())
    await Promise.all(wwjsClientsArray.map((waService) => waService.close()))

    this.logger.debug('WWJSClients disconnected successfully!')
  }
}
