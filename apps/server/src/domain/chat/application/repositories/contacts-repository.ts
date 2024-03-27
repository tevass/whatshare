import { WAEntityID } from '@/core/entities/wa-entity-id'
import { PaginationParams } from '@/domain/shared/application/repositories/pagination-params'
import { SearchParams } from '@/domain/shared/application/repositories/search-params'
import { Contact } from '../../enterprise/entities/contact'

export interface ContactsRepositoryFilters {
  isMyContact?: boolean
}

export interface ContactsRepositoryFindByIdParams {
  id: string
}

export interface ContactsRepositoryFindByPhoneParams {
  phone: string
}

export interface ContactsRepositoryFindByWAContactIdParams {
  waContactId: WAEntityID
}

export interface ContactsRepositoryFindManyByWAContactsIdsParams {
  waContactsIds: WAEntityID[]
}

export interface ContactsRepositoryFindManyParams
  extends PaginationParams,
    SearchParams,
    ContactsRepositoryFilters {}

export interface ContactsRepositoryCountManyParams
  extends SearchParams,
    ContactsRepositoryFilters {}

export abstract class ContactsRepository {
  abstract findById(
    params: ContactsRepositoryFindByIdParams,
  ): Promise<Contact | null>

  abstract findByPhone(
    params: ContactsRepositoryFindByPhoneParams,
  ): Promise<Contact | null>

  abstract findByWAContactId(
    params: ContactsRepositoryFindByWAContactIdParams,
  ): Promise<Contact | null>

  abstract findManyByWAContactsIds(
    params: ContactsRepositoryFindManyByWAContactsIdsParams,
  ): Promise<Contact[]>

  abstract findMany(
    params: ContactsRepositoryFindManyParams,
  ): Promise<Contact[]>

  abstract countMany(params: ContactsRepositoryCountManyParams): Promise<number>

  abstract create(contact: Contact): Promise<void>

  abstract createMany(contact: Contact[]): Promise<void>

  abstract save(contact: Contact): Promise<void>

  abstract saveMany(contacts: Contact[]): Promise<void>
}
