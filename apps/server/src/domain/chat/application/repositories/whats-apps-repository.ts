import { WhatsApp } from '../../enterprise/entities/whats-app'

export interface WhatsAppsRepositoryFindByIdParams {
  id: string
}

export interface WhatsAppsRepositoryFindManyByIdsParams {
  ids: string[]
}

export abstract class WhatsAppsRepository {
  abstract findById(
    params: WhatsAppsRepositoryFindByIdParams,
  ): Promise<WhatsApp | null>

  abstract findManyByIds(
    params: WhatsAppsRepositoryFindManyByIdsParams,
  ): Promise<WhatsApp[]>

  abstract findAll(): Promise<WhatsApp[]>

  abstract save(whatsApp: WhatsApp): Promise<void>
}
