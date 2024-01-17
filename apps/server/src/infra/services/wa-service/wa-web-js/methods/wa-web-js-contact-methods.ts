import { WAContact } from '@/domain/chat/application/entities/wa-contact'
import { WAContactMethods } from '@/domain/chat/application/services/wa-service'
import WAWebJS from 'whatsapp-web.js'

export class WAWebJSContactMethods implements WAContactMethods {
  protected constructor(private client: WAWebJS.Client) {}

  getMany(): Promise<WAContact[]> {
    throw new Error('Method not implemented.')
  }

  static create(client: WAWebJS.Client) {
    return new WAWebJSContactMethods(client)
  }
}
