import 'dotenv/config'

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

import { makeAttendant } from '@/test/factories/make-attendant'
import { makeAttendantProfile } from '@/test/factories/make-attendant-profile'
import { makeWhatsApp } from '@/test/factories/make-whats-app'

import { AttendantWhatsAppList } from '@/domain/chat/enterprise/entities/attendant-whats-app-list'
import { PrismaAttendantMapper } from '@/infra/database/prisma/mappers/prisma-attendant-mapper'
import { PrismaAttendantProfileMapper } from '@/infra/database/prisma/mappers/prisma-attendant-profile-mapper'
import { PrismaWhatsAppMapper } from '@/infra/database/prisma/mappers/prisma-whats-app-mapper'

const prisma = new PrismaClient()

async function main() {
  const whatsApp = makeWhatsApp({
    name: 'WPP1',
  })

  await prisma.whatsApp.create({
    data: PrismaWhatsAppMapper.toPrismaCreate(whatsApp),
  })

  const attendantProfile = makeAttendantProfile({
    name: 'Estevão',
    displayName: 'Estevão',
    email: 'teh.gabriel10@gmail.com',
  })

  await prisma.attendantProfile.create({
    data: PrismaAttendantProfileMapper.toPrismaCreate(attendantProfile),
  })

  const attendant = makeAttendant({
    profile: attendantProfile,
    whatsAppsList: AttendantWhatsAppList.create([whatsApp]),
    password: await bcrypt.hash('abc@123', 8),
  })

  await prisma.attendant.create({
    data: PrismaAttendantMapper.toPrismaCreate(attendant),
  })
}

main()
  .then(() => console.log('Seed successful!'))
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
