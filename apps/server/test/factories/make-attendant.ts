import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Attendant,
  AttendantProps,
} from '@/domain/chat/enterprise/entities/attendant'
import { makeAttendantProfile } from './make-attendant-profile'

export const makeAttendant = (
  override: Partial<AttendantProps> = {},
  id?: UniqueEntityID,
) => {
  return Attendant.create(
    {
      profile: makeAttendantProfile(),
      ...override,
    },
    id,
  )
}
