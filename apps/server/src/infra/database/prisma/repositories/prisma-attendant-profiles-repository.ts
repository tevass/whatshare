import { AttendantProfilesRepository } from '@/domain/chat/application/repositories/attendant-profiles-repository'
import { AttendantProfile } from '@/domain/chat/enterprise/entities/attendant-profile'
import { Injectable } from '@nestjs/common'
import { PrismaAttendantProfileMapper } from '../mappers/prisma-attendant-profile-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaAttendantProfilesRepository
  implements AttendantProfilesRepository
{
  constructor(private prisma: PrismaService) {}

  async create(profile: AttendantProfile): Promise<void> {
    const data = PrismaAttendantProfileMapper.toPrismaCreate(profile)

    await this.prisma.attendantProfile.create({
      data,
    })
  }

  async save(profile: AttendantProfile): Promise<void> {
    const data = PrismaAttendantProfileMapper.toPrismaUpdate(profile)

    await this.prisma.attendantProfile.update({
      data,
      where: {
        id: profile.id.toString(),
      },
    })
  }
}
