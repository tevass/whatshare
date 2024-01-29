import {
  ContactsRepository,
  ContactsRepositoryCountManyParams,
  ContactsRepositoryFilters,
  ContactsRepositoryFindByIdParams,
  ContactsRepositoryFindByPhoneParams,
  ContactsRepositoryFindByWAContactIdParams,
  ContactsRepositoryFindManyByWAContactsIdsParams,
  ContactsRepositoryFindManyParams,
} from '@/domain/chat/application/repositories/contacts-repository'
import { Contact } from '@/domain/chat/enterprise/entities/contact'
import { Pagination } from '@/domain/shared/enterprise/utilities/pagination'
import { TypeGuards } from '@/infra/utils/type-guards'
import { TextTesting } from '../utils/text-testing'

interface ResolveFiltersParams extends ContactsRepositoryFilters {
  item: Contact
}

export class InMemoryContactsRepository implements ContactsRepository {
  items: Contact[] = []

  private resolveFilters({ item, ...filters }: ResolveFiltersParams) {
    const { isGroup, isMyContact } = filters ?? {}

    return TypeGuards.isNotUndefined(isGroup)
      ? item.isGroup === isGroup
      : true && TypeGuards.isNotUndefined(isMyContact)
        ? item.isMyContact
        : true
  }

  async findById(
    params: ContactsRepositoryFindByIdParams,
  ): Promise<Contact | null> {
    const { id } = params
    const contact = this.items.find((item) => item.id.toString() === id)

    return contact ?? null
  }

  async findByPhone(
    params: ContactsRepositoryFindByPhoneParams,
  ): Promise<Contact | null> {
    const { phone } = params
    const contact = this.items.find((item) => item.phone.number === phone)

    return contact ?? null
  }

  async findByWAContactId(
    params: ContactsRepositoryFindByWAContactIdParams,
  ): Promise<Contact | null> {
    const { waContactId } = params

    const contact = this.items.find((item) =>
      item.waContactId.equals(waContactId),
    )

    return contact ?? null
  }

  async findManyByWAContactsIds(
    params: ContactsRepositoryFindManyByWAContactsIdsParams,
  ): Promise<Contact[]> {
    const { waContactsIds } = params

    const contacts = this.items.filter((item) =>
      waContactsIds.includes(item.waContactId),
    )

    return contacts
  }

  async findMany(params: ContactsRepositoryFindManyParams): Promise<Contact[]> {
    const { page, take, query, ...filters } = params

    return this.items
      .filter((item) => (query ? TextTesting.includes(item.name, query) : true))
      .filter((item) => this.resolveFilters({ item, ...filters }))
      .slice(Pagination.skip({ limit: take, page }), page * take)
  }

  async countMany(params: ContactsRepositoryCountManyParams): Promise<number> {
    const { query, ...filters } = params

    return this.items
      .filter((item) => (query ? TextTesting.includes(item.name, query) : true))
      .filter((item) => this.resolveFilters({ item, ...filters })).length
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
