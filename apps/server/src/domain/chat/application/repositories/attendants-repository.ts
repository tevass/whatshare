import { Attendant } from '../../enterprise/entities/attendant'

export interface AttendantsRepositoryFindByIdParams {
  id: string
}

export interface AttendantsRepositoryFindByEmailParams {
  email: string
}

export abstract class AttendantsRepository {
  abstract findById(
    params: AttendantsRepositoryFindByIdParams,
  ): Promise<Attendant | null>

  abstract findByEmail(
    params: AttendantsRepositoryFindByEmailParams,
  ): Promise<Attendant | null>

  abstract create(attendant: Attendant): Promise<void>
}
