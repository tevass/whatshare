import {
  AttendantsRepository,
  AttendantsRepositoryFindByEmailParams,
  AttendantsRepositoryFindByIdParams,
} from '@/domain/chat/application/repositories/attendants-repository'
import { Attendant } from '@/domain/chat/enterprise/entities/attendant'
import { Injectable } from '@nestjs/common'
import { PrismaAttendantMapper } from '../mappers/prisma-attendant-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaAttendantsRepository implements AttendantsRepository {
  constructor(private prisma: PrismaService) {}

  private aggregate = {
    profile: true,
  }

  async findById(
    params: AttendantsRepositoryFindByIdParams,
  ): Promise<Attendant | null> {
    const { id } = params

    const raw = await this.prisma.attendant.findUnique({
      where: {
        id,
      },
      include: this.aggregate,
    })

    if (!raw) return null

    return PrismaAttendantMapper.toDomain(raw)
  }

  async findByEmail(
    params: AttendantsRepositoryFindByEmailParams,
  ): Promise<Attendant | null> {
    const { email } = params

    const raw = await this.prisma.attendant.findFirst({
      where: {
        profile: {
          email,
        },
      },
      include: this.aggregate,
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
