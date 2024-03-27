import {
  AttendantsRepository,
  AttendantsRepositoryFindByEmailParams,
  AttendantsRepositoryFindByIdParams,
} from '@/domain/chat/application/repositories/attendants-repository'
import { Attendant } from '@/domain/chat/enterprise/entities/attendant'

export class InMemoryAttendantsRepository implements AttendantsRepository {
  constructor() {}

  items: Attendant[] = []

  async findById(
    params: AttendantsRepositoryFindByIdParams,
  ): Promise<Attendant | null> {
    const { id } = params

    const item = this.items.find((item) => item.id.toString() === id)

    if (!item) return null

    return item
  }

  async findByEmail(
    params: AttendantsRepositoryFindByEmailParams,
  ): Promise<Attendant | null> {
    const { email } = params

    const item = this.items.find((item) => item.profile.email === email)
    if (!item) return null

    return item
  }

  async create(attendant: Attendant): Promise<void> {
    this.items.push(attendant)
  }
}
