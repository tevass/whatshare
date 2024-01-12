import { AttendantProfilesRepository } from '@/domain/chat/application/repositories/attendant-profiles-repository'
import { AttendantsRepository } from '@/domain/chat/application/repositories/attendants-repository'
import { WhatsAppsRepository } from '@/domain/chat/application/repositories/whats-apps-repository'
import { Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { PrismaAttendantProfilesRepository } from './repositories/prisma-attendant-profiles-repository'
import { PrismaAttendantsRepository } from './repositories/prisma-attendants-repository'
import { PrismaWhatsAppsRepository } from './repositories/prisma-whats-apps-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: AttendantProfilesRepository,
      useClass: PrismaAttendantProfilesRepository,
    },
    { provide: AttendantsRepository, useClass: PrismaAttendantsRepository },
    { provide: WhatsAppsRepository, useClass: PrismaWhatsAppsRepository },
  ],
  exports: [
    PrismaService,
    AttendantProfilesRepository,
    AttendantsRepository,
    WhatsAppsRepository,
  ],
})
export class PrismaModule {}
