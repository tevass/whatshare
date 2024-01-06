import { WhatsAppsRepository } from '@/domain/chat/application/repositories/whats-apps-repository'
import { WhatsApp } from '@/domain/chat/enterprise/entities/whats-app'
import { BaseInMemory } from './base-in-memory'

export class InMemoryWhatsAppsRepository
  extends BaseInMemory<WhatsApp>
  implements WhatsAppsRepository
{
  async findById(id: string): Promise<WhatsApp | null> {
    const item = this.items.find((item) => item.id.toString() === id)

    if (!item) return null

    return item
  }

  async findManyByIds(ids: string[]): Promise<WhatsApp[]> {
    return this.items.filter((item) => ids.includes(item.id.toString()))
  }
}
