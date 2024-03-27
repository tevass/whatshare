import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  AttendantProfile,
  AttendantProfileProps,
} from '@/domain/chat/enterprise/entities/value-objects/attendant-profile'
import { PrismaAttendantProfileMapper } from '@/infra/database/prisma/mappers/prisma-attendant-profile-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

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

@Injectable()
export class FakeAttendantProfileFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAttendantProfile(
    data: Partial<AttendantProfileProps> = {},
    id?: UniqueEntityID,
  ): Promise<AttendantProfile> {
    const profile = makeAttendantProfile(data)

    await this.prisma.attendantProfile.create({
      data: PrismaAttendantProfileMapper.toPrismaCreate(profile),
    })

    return profile
  }
}
