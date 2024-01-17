import { WAContact } from '@/domain/chat/application/entities/wa-contact'
import { WAContactService } from '@/domain/chat/application/services/wa-contact-service'

export class FakeWAContactService implements WAContactService {
  contacts: WAContact[] = []

  async getMany(): Promise<WAContact[]> {
    return this.contacts
  }
}
