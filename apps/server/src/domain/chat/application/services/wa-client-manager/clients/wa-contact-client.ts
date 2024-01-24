import { WAContact } from '../../../entities/wa-contact'

export abstract class WAContactClient {
  abstract getMany(): Promise<WAContact[]>
}
