import { AttendantProfilesRepository } from '@/domain/chat/application/repositories/attendant-profiles-repository'
import { AttendantProfile } from '@/domain/chat/enterprise/entities/attendant-profile'

export class InMemoryAttendantProfilesRepository
  implements AttendantProfilesRepository
{
  items: AttendantProfile[] = []

  async create(attendantProfile: AttendantProfile): Promise<void> {
    this.items.push(attendantProfile)
  }

  async save(attendantProfile: AttendantProfile): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === attendantProfile.id.toString(),
    )

    this.items[itemIndex] = attendantProfile
  }
}
