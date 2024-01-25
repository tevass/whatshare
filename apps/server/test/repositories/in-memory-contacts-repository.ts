import {
  ContactsRepository,
  CountManyParams,
  FindByWAContactIdParams,
  FindManyByWAContactsIdsParams,
  FindManyParams,
} from '@/domain/chat/application/repositories/contacts-repository'
import { Contact } from '@/domain/chat/enterprise/entities/contact'
import { Pagination } from '@/domain/shared/enterprise/utilities/pagination'
import { Text } from '../utils/text'

export class InMemoryContactsRepository implements ContactsRepository {
  items: Contact[] = []

  async findByWAContactId(
    params: FindByWAContactIdParams,
  ): Promise<Contact | null> {
    const { waContactId, includeUnknowns = false } = params

    const contact = this.items.find(
      (item) =>
        item.waContactId.equals(waContactId) &&
        (includeUnknowns ? true : item.isMyContact),
    )

    if (!contact) return null

    return contact
  }

  async findManyByWAContactsIds(
    params: FindManyByWAContactsIdsParams,
  ): Promise<Contact[]> {
    const { waContactsIds, includeUnknowns = false } = params

    const contacts = this.items.filter(
      (item) =>
        waContactsIds.includes(item.waContactId) &&
        (includeUnknowns ? true : item.isMyContact),
    )

    return contacts
  }

  async findMany(params: FindManyParams): Promise<Contact[]> {
    const { page, take, query } = params

    return this.items
      .filter((item) => (query ? Text.includes(item.name, query) : true))
      .slice(Pagination.skip({ limit: take, page }), page * take)
  }

  async countMany(params: CountManyParams): Promise<number> {
    const { query } = params

    return this.items.filter((item) =>
      query ? Text.includes(item.name, query) : true,
    ).length
  }

  async create(contact: Contact): Promise<void> {
    this.items.push(contact)
  }

  async createMany(entities: Contact[]): Promise<void> {
    this.items.push(...entities)
  }
}
