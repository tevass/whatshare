import { WAContact } from '../entities/wa-contact';

export abstract class WAContactService {
  abstract getMany(): Promise<WAContact[]>
}
