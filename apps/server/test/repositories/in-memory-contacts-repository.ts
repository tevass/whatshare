import { WAEntityID } from '@/core/entities/wa-entity-id'
import { ContactsRepository } from '@/domain/chat/application/repositories/contacts-repository'
import { Contact } from '@/domain/chat/enterprise/entities/contact'
import { BaseInMemory } from './base-in-memory'

export class InMemoryContactsRepository
  extends BaseInMemory<Contact>
  implements ContactsRepository
{
  async findByWAContactId(waContactId: WAEntityID): Promise<Contact | null> {
    const contact = this.items.find((item) =>
      item.waContactId.equals(waContactId),
    )

    if (!contact) return null

    return contact
  }

  async findManyByWAContactIds(waContactIds: WAEntityID[]): Promise<Contact[]> {
    const contacts = this.items.filter((item) =>
      waContactIds.includes(item.waContactId),
    )

    return contacts
  }
}
