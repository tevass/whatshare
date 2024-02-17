import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Attendant,
  AttendantProps,
} from '@/domain/chat/enterprise/entities/attendant'
import { PrismaAttendantMapper } from '@/infra/database/prisma/mappers/prisma-attendant-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import {
  FakeAttendantProfileFactory,
  makeAttendantProfile,
} from './make-attendant-profile'
import { makeUniqueEntityID } from './make-unique-entity-id'

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

  attendant.profile.set({ attendantId })

  return attendant
}

@Injectable()
export class FakeAttendantFactory {
  constructor(
    private prisma: PrismaService,
    private fakeProfile: FakeAttendantProfileFactory,
  ) {}

  async makePrismaAttendant(
    data: Partial<AttendantProps> = {},
    id?: UniqueEntityID,
  ): Promise<Attendant> {
    const profile =
      data.profile ??
      (await this.fakeProfile.makePrismaAttendantProfile(data.profile))

    const attendant = makeAttendant({ ...data, profile }, id)

    await this.prisma.attendant.create({
      data: PrismaAttendantMapper.toPrismaCreate(attendant),
    })

    return attendant
  }
}
