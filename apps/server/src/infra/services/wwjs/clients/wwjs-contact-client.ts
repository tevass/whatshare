import WWJS from 'whatsapp-web.js'

import { WAEntityID } from '@/core/entities/wa-entity-id'
import { WAContact } from '@/domain/chat/application/entities/wa-contact'
import { WAContactClient } from '@/domain/chat/application/services/wa-client-manager/clients/wa-contact-client'
import { WWJSContactMapper } from '../mappers/wwjs-contact-mapper'
import { WWJSClient } from './wwjs-client'

export class WWJSContactClient implements WAContactClient {
  private raw: WWJS.Client

  protected constructor(private wwjsClient: WWJSClient) {
    this.raw = wwjsClient.switchToRaw()
  }

  async getById(contactId: WAEntityID): Promise<WAContact> {
    const raw = await this.raw.getContactById(contactId.toString())

    return await WWJSContactMapper.toDomain({ raw })
  }

  async getMany(): Promise<WAContact[]> {
    const allWaContacts = await this.raw.getContacts()

    const waContacts = allWaContacts.filter(
      (waContact) =>
        waContact.isMyContact || waContact.isMe || waContact.isWAContact,
    )

    return await Promise.all(
      waContacts.map((raw) => WWJSContactMapper.toDomain({ raw })),
    )
  }

  static create(client: WWJSClient) {
    return new WWJSContactClient(client)
  }
}
