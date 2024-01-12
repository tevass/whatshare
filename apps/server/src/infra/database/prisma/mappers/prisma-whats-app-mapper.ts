import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WhatsApp } from '@/domain/chat/enterprise/entities/whats-app'
import { Prisma, WhatsApp as PrismaWhatsApp } from '@prisma/client'

export type RawWhatsApp = PrismaWhatsApp

export class PrismaWhatsAppMapper {
  static toDomain(raw: RawWhatsApp): WhatsApp {
    return WhatsApp.create(
      {
        name: raw.name,
        qrCode: raw.qrCode,
        status: raw.status,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrismaCreate(
    whatsApp: WhatsApp,
  ): Prisma.WhatsAppUncheckedCreateInput {
    return {
      id: whatsApp.id.toString(),
      name: whatsApp.name,
      qrCode: whatsApp.qrCode,
      status: whatsApp.status,
    }
  }

  static toPrismaUpdate(
    whatsApp: WhatsApp,
  ): Prisma.WhatsAppUncheckedUpdateInput {
    return {
      name: whatsApp.name,
      qrCode: whatsApp.qrCode,
      status: whatsApp.status,
    }
  }
}
