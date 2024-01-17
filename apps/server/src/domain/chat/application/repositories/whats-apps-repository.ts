import { WhatsApp } from '../../enterprise/entities/whats-app'

export abstract class WhatsAppsRepository {
  abstract findById(id: string): Promise<WhatsApp | null>

  abstract findManyByIds(ids: string[]): Promise<WhatsApp[]>

  abstract findAll(): Promise<WhatsApp[]>

  abstract save(whatsApp: WhatsApp): Promise<void>
}
