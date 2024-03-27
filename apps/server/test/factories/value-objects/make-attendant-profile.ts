import {
  AttendantProfile,
  AttendantProfileProps,
} from '@/domain/chat/enterprise/entities/value-objects/attendant-profile'
import { faker } from '@faker-js/faker'

export const makeAttendantProfile = (
  override: Partial<AttendantProfileProps> = {},
) => {
  return AttendantProfile.create({
    name: faker.person.firstName(),
    email: faker.internet.email(),
    displayName: faker.internet.userName(),
    ...override,
  })
}
