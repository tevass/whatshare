import { Attendant } from '../../enterprise/entities/attendant'

export abstract class AttendantsRepository {
  abstract findById(id: string): Promise<Attendant | null>

  abstract findByEmail(email: string): Promise<Attendant | null>

  abstract create(attendant: Attendant): Promise<void>
}
