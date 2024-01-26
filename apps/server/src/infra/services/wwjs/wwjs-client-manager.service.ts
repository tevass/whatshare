import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WhatsApp } from '@/domain/chat/enterprise/entities/whats-app'
import { WWJSClient } from './clients/wwjs-client'
import { WAClientManager } from '@/domain/chat/application/services/wa-client-manager'
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { WWJSClientService } from './wwjs-client.service'
import { WhatsAppsRepository } from '@/domain/chat/application/repositories/whats-apps-repository'

@Injectable()
export class WWJSClientManager
  implements WAClientManager, OnModuleInit, OnModuleDestroy
{
  constructor(
    private wwjsClientService: WWJSClientService,
    private whatsAppsRepository: WhatsAppsRepository,
  ) {}

  clients: Map<string, WWJSClient> = new Map()

  getConnected(waClientId: UniqueEntityID): WWJSClient | null {
    const client = this.clients.get(waClientId.toString())
    return client && client.isConnected() ? client : null
  }

  setFromWhatsApp(whatsApp: WhatsApp): void {
    const client = this.clients.get(whatsApp.id.toString())
    if (!client) return

    client.setFromWhatsApp(whatsApp)
  }

  async onModuleInit() {
    const whatsApps = await this.whatsAppsRepository.findAll()

    const clients = whatsApps.map((whatsApp) =>
      this.wwjsClientService.createFromWhatsApp(whatsApp),
    )

    clients.forEach((client) =>
      this.wwjsClientService.registerHandlersInClient(client),
    )

    this.clients = new Map(
      clients.map((client) => [client.id.toString(), client]),
    )

    Promise.all(clients.map((client) => client.init()))
  }

  async onModuleDestroy() {
    const clients = Array.from(this.clients.values())
    await Promise.all(clients.map((client) => client.close()))
  }
}
