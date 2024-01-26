import { WAEntityID } from '@/core/entities/wa-entity-id'
import { PaginationParams } from '@/domain/shared/application/repositories/pagination-params'
import { SearchParams } from '@/domain/shared/application/repositories/search-params'
import { Contact } from '../../enterprise/entities/contact'

interface ContactsRepositoryMethodsParams {
  includeUnknowns?: boolean
}

export interface FindByPhoneParams extends ContactsRepositoryMethodsParams {
  phone: string
}

export interface FindByWAContactIdParams
  extends ContactsRepositoryMethodsParams {
  waContactId: WAEntityID
}

export interface FindManyByWAContactsIdsParams
  extends ContactsRepositoryMethodsParams {
  waContactsIds: WAEntityID[]
}

export interface FindManyParams
  extends ContactsRepositoryMethodsParams,
    PaginationParams,
    SearchParams {}

export interface CountManyParams
  extends ContactsRepositoryMethodsParams,
    SearchParams {}

export abstract class ContactsRepository {
  abstract findByPhone(params: FindByPhoneParams): Promise<Contact | null>

  abstract findByWAContactId(
    params: FindByWAContactIdParams,
  ): Promise<Contact | null>

  abstract findManyByWAContactsIds(
    params: FindManyByWAContactsIdsParams,
  ): Promise<Contact[]>

  abstract findMany(params: FindManyParams): Promise<Contact[]>

  abstract countMany(params: CountManyParams): Promise<number>

  abstract create(contact: Contact): Promise<void>

  abstract createMany(contact: Contact[]): Promise<void>

  abstract save(contact: Contact): Promise<void>
}
