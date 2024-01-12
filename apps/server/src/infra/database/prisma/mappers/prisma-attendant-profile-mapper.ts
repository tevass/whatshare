import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AttendantProfile } from '@/domain/chat/enterprise/entities/attendant-profile'
import {
  Prisma,
  AttendantProfile as PrismaAttendantProfile,
} from '@prisma/client'

export type RawAttendantProfile = PrismaAttendantProfile

export class PrismaAttendantProfileMapper {
  static toDomain(raw: RawAttendantProfile): AttendantProfile {
    return AttendantProfile.create(
      {
        displayName: raw.displayName,
        email: raw.email,
        name: raw.name,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrismaCreate(
    profile: AttendantProfile,
  ): Prisma.AttendantProfileUncheckedCreateInput {
    return {
      id: profile.id.toString(),
      displayName: profile.displayName,
      email: profile.email,
      name: profile.name,
    }
  }

  static toPrismaUpdate(
    profile: AttendantProfile,
  ): Prisma.AttendantProfileUncheckedUpdateInput {
    return {
      displayName: profile.displayName,
      email: profile.email,
      name: profile.name,
    }
  }
}
