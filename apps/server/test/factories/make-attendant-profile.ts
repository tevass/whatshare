import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  AttendantProfile,
  AttendantProfileProps,
} from '@/domain/chat/enterprise/entities/attendant-profile'
import { faker } from '@faker-js/faker'
import { makeUniqueEntityID } from './make-unique-entity-id'

export const makeAttendantProfile = (
  override: Partial<AttendantProfileProps> = {},
  id?: UniqueEntityID,
) => {
  return AttendantProfile.create(
    {
      name: faker.person.firstName(),
      email: faker.internet.email(),
      displayName: faker.internet.userName(),
      attendantId: makeUniqueEntityID(),
      ...override,
    },
    id,
  )
}
