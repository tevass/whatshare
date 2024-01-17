import { WhatsAppsRepository } from '@/domain/chat/application/repositories/whats-apps-repository'
import { WhatsApp } from '@/domain/chat/enterprise/entities/whats-app'
import { Injectable } from '@nestjs/common'
import { PrismaWhatsAppMapper } from '../mappers/prisma-whats-app-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaWhatsAppsRepository implements WhatsAppsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<WhatsApp | null> {
    const raw = await this.prisma.whatsApp.findUnique({
      where: {
        id,
      },
    })

    if (!raw) return null

    return PrismaWhatsAppMapper.toDomain(raw)
  }

  async findManyByIds(ids: string[]): Promise<WhatsApp[]> {
    const raw = await this.prisma.whatsApp.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    })

    return raw.map(PrismaWhatsAppMapper.toDomain)
  }

  async findAll(): Promise<WhatsApp[]> {
    const raw = await this.prisma.whatsApp.findMany()

    return raw.map(PrismaWhatsAppMapper.toDomain)
  }

  async save(whatsApp: WhatsApp): Promise<void> {
    const data = PrismaWhatsAppMapper.toPrismaUpdate(whatsApp)

    await this.prisma.whatsApp.update({
      data,
      where: {
        id: whatsApp.id.toString(),
      },
    })
  }
}
