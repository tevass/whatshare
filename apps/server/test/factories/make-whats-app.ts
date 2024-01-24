import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  WhatsApp,
  WhatsAppProps,
} from '@/domain/chat/enterprise/entities/whats-app'
import { PrismaWhatsAppMapper } from '@/infra/database/prisma/mappers/prisma-whats-app-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export const makeWhatsApp = (
  override: Partial<WhatsAppProps> = {},
  id?: UniqueEntityID,
) => {
  return WhatsApp.create(
    {
      name: faker.company.name(),
      ...override,
    },
    id,
  )
}

@Injectable()
export class FakeWhatsAppFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaWhatsApp(
    data: Partial<WhatsAppProps> = {},
  ): Promise<WhatsApp> {
    const whatsApp = makeWhatsApp(data)

    await this.prisma.whatsApp.create({
      data: PrismaWhatsAppMapper.toPrismaCreate(whatsApp),
    })

    return whatsApp
  }

  async makeWWJSWhatsApp(
    data: Partial<WhatsAppProps> = {},
    id?: UniqueEntityID,
  ): Promise<WhatsApp> {
    const whatsApp = makeWhatsApp(data, id)

    await this.prisma.whatsApp.create({
      data: PrismaWhatsAppMapper.toPrismaCreate(whatsApp),
    })

    return whatsApp
  }
}
