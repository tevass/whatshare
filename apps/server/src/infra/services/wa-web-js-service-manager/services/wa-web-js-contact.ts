import { WAContact } from '@/domain/chat/application/entities/wa-contact'
import { WAContactService } from '@/domain/chat/application/services/wa-contact-service'
import WAWebJS from 'whatsapp-web.js'
import { WAWebJSContactMapper } from '../mappers/wa-web-js-contact-mapper'
import { WAWebJSService } from '../wa-web-js-service'

export class WAWebJSContactService implements WAContactService {
  private raw: WAWebJS.Client

  protected constructor(private waService: WAWebJSService) {
    this.raw = waService.switchToRaw()
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

  static create(client: WAWebJSService) {
    return new WAWebJSContactService(client)
  }
}
