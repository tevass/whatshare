import {
  AttendantProfile,
  AttendantProfileProps,
} from '@/domain/chat/enterprise/entities/attendant-profile'
import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '@whatshare/server-core/entities'
import { makeUniqueEntityID } from '@whatshare/server-core/factories'

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
