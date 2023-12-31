import { AttendantsRepository } from '@/domain/chat/application/repositories/attendants-repository'
import { Attendant } from '@/domain/chat/enterprise/entities/attendant'
import { BaseInMemory } from './base-in-memory'

export class InMemoryAttendantsRepository
  extends BaseInMemory<Attendant>
  implements AttendantsRepository
{
  async findByEmail(email: string): Promise<Attendant | null> {
    const item = this.items.find((item) => item.profile.email === email)
    if (!item) return null

    return item
  }
}
