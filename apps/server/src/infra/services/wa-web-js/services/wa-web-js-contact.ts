import { WAContact } from '@/domain/chat/application/entities/wa-contact'
import { WAContactService } from '@/domain/chat/application/services/wa-contact-service'
import WAWebJS from 'whatsapp-web.js'
import { WAWebJSContactMapper } from '../mappers/wa-web-js-contact-mapper'
import { WAWebJSClient } from '../wa-web-js-client'

export class WAWebJSContactService implements WAContactService {
  private raw: WAWebJS.Client

  protected constructor(private waClient: WAWebJSClient) {
    this.raw = waClient.switchToRaw()
  }

  async getMany(): Promise<WAContact[]> {
    const allWaContacts = await this.raw.getContacts()

    const waContacts = allWaContacts.filter(
      (waContact) => waContact.isMyContact || !waContact.isMe,
    )

    return await Promise.all(
      waContacts.map((raw) => WAWebJSContactMapper.toDomain({ raw })),
    )
  }

  static create(client: WAWebJSClient) {
    return new WAWebJSContactService(client)
  }
}
