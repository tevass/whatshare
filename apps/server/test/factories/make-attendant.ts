import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Attendant,
  AttendantProps,
} from '@/domain/chat/enterprise/entities/attendant'
import { makeUniqueEntityID } from './make-unique-entity-id'
import { makeAttendantProfile } from './value-objects/make-attendant-profile'

export const makeAttendant = (
  override: Partial<AttendantProps> = {},
  id?: UniqueEntityID,
) => {
  const attendantId = id ?? makeUniqueEntityID()
  const attendant = Attendant.create(
    {
      profile: makeAttendantProfile(),
      ...override,
    },
    attendantId,
  )

  return attendant
}
