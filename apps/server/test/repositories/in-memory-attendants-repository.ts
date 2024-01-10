import { AttendantsRepository } from '@/domain/chat/application/repositories/attendants-repository'
import { Attendant } from '@/domain/chat/enterprise/entities/attendant'
import { InMemoryAttendantProfilesRepository } from './in-memory-attendant-profiles-repository'

export class InMemoryAttendantsRepository implements AttendantsRepository {
  constructor(private profileRepository: InMemoryAttendantProfilesRepository) {}

  items: Attendant[] = []

  async findById(id: string): Promise<Attendant | null> {
    const item = this.items.find((item) => item.id.toString() === id)

    if (!item) return null

    return item
  }

  async findByEmail(email: string): Promise<Attendant | null> {
    const item = this.items.find((item) => item.profile.email === email)
    if (!item) return null

    return item
  }

  async create(attendant: Attendant): Promise<void> {
    this.items.push(attendant)

    await this.profileRepository.save(attendant.profile)
  }
}
