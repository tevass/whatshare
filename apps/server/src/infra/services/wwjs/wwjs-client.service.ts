import { Injectable } from '@nestjs/common'
import { WWJSHandler } from './wwjs-handler'
import { EnvService } from '@/infra/env/env.service'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import WWJS, { LocalAuth } from 'whatsapp-web.js'

import { args as BROWSER_ARGS } from './browser-args.json'
import { WWJSClient } from './clients/wwjs-client'
import { WhatsApp } from '@/domain/chat/enterprise/entities/whats-app'

@Injectable()
export class WWJSClientService {
  constructor(private env: EnvService) {}

  private handlers: WWJSHandler[] = []

  addHandler(handler: WWJSHandler) {
    this.handlers.push(handler)
  }

  createRawClient(clientId: UniqueEntityID) {
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

  registerHandlersInClient(client: WWJSClient) {
    this.handlers.forEach((handler) => {
      client.addEvent(handler)
    })
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
