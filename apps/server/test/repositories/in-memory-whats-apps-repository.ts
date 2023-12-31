import { WhatsAppsRepository } from '@/domain/chat/application/repositories/whats-apps-repository'
import { WhatsApp } from '@/domain/chat/enterprise/entities/whats-app'
import { BaseInMemory } from './base-in-memory'

export class InMemoryWhatsAppsRepository
  extends BaseInMemory<WhatsApp>
  implements WhatsAppsRepository {}
