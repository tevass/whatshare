import { WhatsApp } from '../../enterprise/entities/whats-app';

export abstract class WhatsAppsRepository {
  abstract findManyByIds(ids: string[]): Promise<WhatsApp[]>
}
