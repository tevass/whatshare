import { WAContact } from '@/domain/chat/application/entities/wa-contact'
import { WAContactClient } from '@/domain/chat/application/services/wa-client-manager/clients/wa-contact-client'

export class FakeWAContactClient implements WAContactClient {
  contacts: WAContact[] = []

  async getMany(): Promise<WAContact[]> {
    return this.contacts
  }
}
