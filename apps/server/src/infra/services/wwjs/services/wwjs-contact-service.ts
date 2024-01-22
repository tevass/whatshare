import { WAContact } from '@/domain/chat/application/entities/wa-contact'
import { WAContactService } from '@/domain/chat/application/services/wa-contact-service'
import WWJS from 'whatsapp-web.js'
import { WWJSClient } from '../client'
import { WWJSContactMapper } from '../mappers/wwjs-contact-mapper'

export class WWJSContactService implements WAContactService {
  private raw: WWJS.Client

  protected constructor(private waClient: WWJSClient) {
    this.raw = waClient.switchToRaw()
  }

  async getMany(): Promise<WAContact[]> {
    const allWaContacts = await this.raw.getContacts()

    const waContacts = allWaContacts.filter(
      (waContact) => waContact.isMyContact || !waContact.isMe,
    )

    return await Promise.all(
      waContacts.map((raw) => WWJSContactMapper.toDomain({ raw })),
    )
  }

  static create(client: WWJSClient) {
    return new WWJSContactService(client)
  }
}
