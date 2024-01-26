import { WAEntityID } from '@/core/entities/wa-entity-id'
import { WAContact } from '../../../entities/wa-contact'

export abstract class WAContactClient {
  abstract getById(contactId: WAEntityID): Promise<WAContact>
  abstract getMany(): Promise<WAContact[]>
}
