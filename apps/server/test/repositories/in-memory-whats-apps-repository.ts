import {
  WhatsAppsRepository,
  WhatsAppsRepositoryFindByIdParams,
  WhatsAppsRepositoryFindManyByIdsParams,
} from '@/domain/chat/application/repositories/whats-apps-repository'
import { WhatsApp } from '@/domain/chat/enterprise/entities/whats-app'

export class InMemoryWhatsAppsRepository implements WhatsAppsRepository {
  items: WhatsApp[] = []

  async findById(
    params: WhatsAppsRepositoryFindByIdParams,
  ): Promise<WhatsApp | null> {
    const { id } = params

    const item = this.items.find((item) => item.id.toString() === id)
    if (!item) return null

    return item
  }

  async findManyByIds(
    params: WhatsAppsRepositoryFindManyByIdsParams,
  ): Promise<WhatsApp[]> {
    const { ids } = params

    return this.items.filter((item) => ids.includes(item.id.toString()))
  }

  async findAll(): Promise<WhatsApp[]> {
    return this.items
  }

  async create(whatsApp: WhatsApp): Promise<void> {
    this.items.push(whatsApp)
  }

  async save(whatsApp: WhatsApp): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === whatsApp.id.toString(),
    )

    this.items[itemIndex] = whatsApp
  }
}
