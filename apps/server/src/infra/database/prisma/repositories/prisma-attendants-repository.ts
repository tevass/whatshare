import { AttendantsRepository } from '@/domain/chat/application/repositories/attendants-repository'
import { Attendant } from '@/domain/chat/enterprise/entities/attendant'
import { Injectable } from '@nestjs/common'
import { PrismaAttendantMapper } from '../mappers/prisma-attendant-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaAttendantsRepository implements AttendantsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Attendant | null> {
    const raw = await this.prisma.attendant.findUnique({
      where: {
        id,
      },
      include: {
        profile: true,
      },
    })

    if (!raw) return null

    return PrismaAttendantMapper.toDomain(raw)
  }

  async findByEmail(email: string): Promise<Attendant | null> {
    const profile = await this.prisma.attendantProfile.findUnique({
      where: {
        email,
      },
      select: { id: true },
    })

    if (!profile) return null

    const raw = await this.prisma.attendant.findUnique({
      where: {
        profileId: profile.id,
      },
      include: {
        profile: true,
      },
    })

    if (!raw) return null

    return PrismaAttendantMapper.toDomain(raw)
  }

  async create(attendant: Attendant): Promise<void> {
    const data = PrismaAttendantMapper.toPrismaCreate(attendant)

    await this.prisma.attendant.create({
      data,
    })
  }
}
