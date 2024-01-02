import { WAEntityID } from '@/core/entities/wa-entity-id'
import { Contact } from '../../enterprise/entities/contact'

export abstract class ContactsRepository {
  abstract findByWAContactId(waContactId: WAEntityID): Promise<Contact | null>

  abstract findManyByWAContactIds(
    waContactIds: WAEntityID[],
  ): Promise<Contact[]>

  abstract create(contact: Contact): Promise<void>

  abstract createMany(contact: Contact[]): Promise<void>
}
