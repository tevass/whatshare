import { WAEntityID } from '@/core/entities/wa-entity-id'
import { WAContact } from '@/domain/chat/application/entities/wa-contact'
import { WAContactClient } from '@/domain/chat/application/services/wa-client-manager/clients/wa-contact-client'
import { makeWAContact } from '@/test/factories/make-wa-contact'

export class FakeWAContactClient implements WAContactClient {
  contacts: WAContact[] = []

  async getById(contactId: WAEntityID): Promise<WAContact> {
    const contact = this.contacts.find((item) => item.id.equals(contactId))

    return contact ?? makeWAContact({}, contactId)
  }

  async getMany(): Promise<WAContact[]> {
    return this.contacts
  }
}
