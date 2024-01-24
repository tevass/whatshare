import WWJS from 'whatsapp-web.js'

import { WAContact } from '@/domain/chat/application/entities/wa-contact'
import { WWJSContactMapper } from '../mappers/wwjs-contact-mapper'
import { WAContactClient } from '@/domain/chat/application/services/wa-client-manager/clients/wa-contact-client'
import { WWJSClient } from './wwjs-client'

export class WWJSContactClient implements WAContactClient {
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
    return new WWJSContactClient(client)
  }
}
