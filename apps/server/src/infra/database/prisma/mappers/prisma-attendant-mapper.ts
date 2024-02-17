import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Attendant } from '@/domain/chat/enterprise/entities/attendant'
import { Prisma, Attendant as PrismaAttendant } from '@prisma/client'
import {
  PrismaAttendantProfileMapper,
  RawAttendantProfile,
} from './prisma-attendant-profile-mapper'

export type RawAttendant = PrismaAttendant & {
  profile: RawAttendantProfile
}

export class PrismaAttendantMapper {
  static toDomain(raw: RawAttendant): Attendant {
    return Attendant.create(
      {
        profile: PrismaAttendantProfileMapper.toDomain(raw.profile),
        password: raw.password,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrismaCreate(
    attendant: Attendant,
  ): Prisma.AttendantUncheckedCreateInput {
    return {
      id: attendant.id.toString(),
      profileId: attendant.profile.id.toString(),
      password: attendant.password,
      whatsApps: {
        connect: attendant.whatsAppsList.getItems().map((whatsApp) => ({
          id: whatsApp.id.toString(),
        })),
      },
    }
  }
}
