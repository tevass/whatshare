import { Module } from '@nestjs/common'

import { PrismaService } from './prisma.service'

import { AttendantProfilesRepository } from '@/domain/chat/application/repositories/attendant-profiles-repository'
import { AttendantsRepository } from '@/domain/chat/application/repositories/attendants-repository'
import { WhatsAppsRepository } from '@/domain/chat/application/repositories/whats-apps-repository'
import { ChatsRepository } from '@/domain/chat/application/repositories/chats-repository'
import { MessagesRepository } from '@/domain/chat/application/repositories/messages-repository'
import { MessageMediasRepository } from '@/domain/chat/application/repositories/message-medias-repository'

import { PrismaAttendantProfilesRepository } from './repositories/prisma-attendant-profiles-repository'
import { PrismaAttendantsRepository } from './repositories/prisma-attendants-repository'
import { PrismaWhatsAppsRepository } from './repositories/prisma-whats-apps-repository'
import { PrismaChatsRepository } from './repositories/prisma-chats-repository'
import { PrismaMessagesRepository } from './repositories/prisma-messages-repository'
import { PrismaMessageMediasRepository } from './repositories/prisma-message-medias-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: AttendantProfilesRepository,
      useClass: PrismaAttendantProfilesRepository,
    },
    { provide: AttendantsRepository, useClass: PrismaAttendantsRepository },
    { provide: WhatsAppsRepository, useClass: PrismaWhatsAppsRepository },
    { provide: ChatsRepository, useClass: PrismaChatsRepository },
    { provide: MessagesRepository, useClass: PrismaMessagesRepository },
    {
      provide: MessageMediasRepository,
      useClass: PrismaMessageMediasRepository,
    },
  ],
  exports: [
    PrismaService,
    AttendantProfilesRepository,
    AttendantsRepository,
    WhatsAppsRepository,
    ChatsRepository,
    MessagesRepository,
    MessageMediasRepository,
  ],
})
export class PrismaModule {}
