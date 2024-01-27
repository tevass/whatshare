import {
  ContactsRepository,
  CountManyParams,
  FindByPhoneParams,
  FindByWAContactIdParams,
  FindManyByWAContactsIdsParams,
  FindManyParams,
} from '@/domain/chat/application/repositories/contacts-repository'
import { Contact } from '@/domain/chat/enterprise/entities/contact'
import { Pagination } from '@/domain/shared/enterprise/utilities/pagination'
import { TextTesting } from '../utils/text-testing'

export class InMemoryContactsRepository implements ContactsRepository {
  items: Contact[] = []

  async findByPhone(params: FindByPhoneParams): Promise<Contact | null> {
    const { phone, includeUnknowns } = params

    const contact = this.items.find(
      (item) =>
        item.phone.number === phone &&
        (includeUnknowns ? true : item.isMyContact),
    )

    return contact ?? null
  }

  async findByWAContactId(
    params: FindByWAContactIdParams,
  ): Promise<Contact | null> {
    const { waContactId, includeUnknowns = false } = params

    const contact = this.items.find(
      (item) =>
        item.waContactId.equals(waContactId) &&
        (includeUnknowns ? true : item.isMyContact),
    )

    return contact ?? null
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
      .filter((item) => (query ? TextTesting.includes(item.name, query) : true))
      .slice(Pagination.skip({ limit: take, page }), page * take)
  }

  async countMany(params: CountManyParams): Promise<number> {
    const { query } = params

    return this.items.filter((item) =>
      query ? TextTesting.includes(item.name, query) : true,
    ).length
  }

  async create(contact: Contact): Promise<void> {
    this.items.push(contact)
  }

  async createMany(entities: Contact[]): Promise<void> {
    this.items.push(...entities)
  }

  async save(contact: Contact): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === contact.id.toString(),
    )

    this.items[itemIndex] = contact
  }
}
