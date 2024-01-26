import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WhatsAppsRepository } from '@/domain/chat/application/repositories/whats-apps-repository'
import { WAClientManager } from '@/domain/chat/application/services/wa-client-manager'
import { WhatsApp } from '@/domain/chat/enterprise/entities/whats-app'
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { WWJSClient } from './clients/wwjs-client'
import { WWJSClientService } from './wwjs-client.service'

@Injectable()
export class WWJSClientManager
  implements WAClientManager, OnModuleInit, OnModuleDestroy
{
  constructor(
    private wwjsClientService: WWJSClientService,
    private whatsAppsRepository: WhatsAppsRepository,
  ) {}

  clients: Map<string, WWJSClient> = new Map()

  getConnectedClientById(waClientId: UniqueEntityID): WWJSClient | null {
    const client = this.clients.get(waClientId.toString())
    return client && client.isConnected() ? client : null
  }

  getSomeConnectedClient(): WWJSClient | null {
    const clients = Array.from(this.clients.values())
    const client = clients.find((client) => client.isConnected())

    return client ?? null
  }

  setClientFromWhatsApp(whatsApp: WhatsApp): void {
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
      client.addHandlers(this.wwjsClientService.handlers),
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
