import { WAEntityID } from '@/core/entities/wa-entity-id'
import { Contact } from '../../enterprise/entities/contact'

interface ContactsRepositoryMethodsParams {
  includeUnknowns?: boolean
}

export interface FindByWAContactIdParams
  extends ContactsRepositoryMethodsParams {
  waContactId: WAEntityID
}

export interface FindManyByWAContactsIdsParams
  extends ContactsRepositoryMethodsParams {
  waContactsIds: WAEntityID[]
}

export abstract class ContactsRepository {
  abstract findByWAContactId(
    params: FindByWAContactIdParams,
  ): Promise<Contact | null>

  abstract findManyByWAContactsIds(
    params: FindManyByWAContactsIdsParams,
  ): Promise<Contact[]>

  abstract create(contact: Contact): Promise<void>

  abstract createMany(contact: Contact[]): Promise<void>
}
