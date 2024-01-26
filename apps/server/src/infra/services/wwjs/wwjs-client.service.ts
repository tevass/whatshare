import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { EnvService } from '@/infra/env/env.service'
import { Injectable } from '@nestjs/common'
import WWJS, { LocalAuth } from 'whatsapp-web.js'
import { WWJSHandler } from './wwjs-handler'

import { WhatsApp } from '@/domain/chat/enterprise/entities/whats-app'
import { args as BROWSER_ARGS } from './browser-args.json'
import { WWJSClient } from './clients/wwjs-client'

@Injectable()
export class WWJSClientService {
  constructor(private env: EnvService) {}

  handlers: WWJSHandler[] = []

  addHandler(handler: WWJSHandler) {
    this.handlers.push(handler)
  }

  private createRawClient(clientId: UniqueEntityID) {
    const withoutHeadless = this.env.get('NODE_ENV') === 'production'

    const rawClient = new WWJS.Client({
      authStrategy: new LocalAuth({ clientId: clientId.toString() }),
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

    return rawClient
  }

  createFromWhatsApp(whatsApp: WhatsApp) {
    const rawClient = this.createRawClient(whatsApp.id)

    const client = WWJSClient.create(
      {
        raw: rawClient,
        name: whatsApp.name,
        status: whatsApp.status,
      },
      whatsApp.id,
    )

    return client
  }
}
