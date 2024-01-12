import { AttendantProfile } from '../../enterprise/entities/attendant-profile'

export abstract class AttendantProfilesRepository {
  abstract create(profile: AttendantProfile): Promise<void>
}
