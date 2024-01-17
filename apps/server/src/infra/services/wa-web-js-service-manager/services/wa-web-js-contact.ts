import { WAContact } from '@/domain/chat/application/entities/wa-contact'
import WAWebJS from 'whatsapp-web.js'
import { WAWebJSService } from '../wa-web-js'
import { WAContactService } from '@/domain/chat/application/services/wa-contact-service'

export class WAWebJSContactService implements WAContactService {
  private raw: WAWebJS.Client

  protected constructor(private waService: WAWebJSService) {
    this.raw = waService.switchToRaw()
  }

  getMany(): Promise<WAContact[]> {
    throw new Error('Method not implemented.')
  }

  static create(client: WAWebJSService) {
    return new WAWebJSContactService(client)
  }
}
