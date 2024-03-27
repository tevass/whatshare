import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  GroupChat,
  GroupChatProps,
} from '@/domain/chat/enterprise/entities/group-chat'
import { PrismaGroupChatMapper } from '@/infra/database/prisma/mappers/prisma-group-chat-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
import { FakeContactFactory } from './make-contact'
import { makeGroup } from './make-group'
import { makeUniqueEntityID } from './make-unique-entity-id'
import { makeWAEntityID } from './make-wa-entity-id'

export const makeGroupChat = (
  override: Partial<GroupChatProps> = {},
  id?: UniqueEntityID,
) => {
  return GroupChat.create(
    {
      unreadCount: faker.number.int({ max: 99 }),
      whatsAppId: makeUniqueEntityID(),
      waChatId: makeWAEntityID(),
      group: makeGroup(),
      ...override,
    },
    id,
  )
}

@Injectable()
export class FakeGroupChatFactory {
  constructor(
    private prisma: PrismaService,
    private fakeContact: FakeContactFactory,
  ) {}

  async makePrismaGroupChat(
    data: Partial<GroupChatProps> = {},
    id?: UniqueEntityID,
  ): Promise<GroupChat> {
    const chat = makeGroupChat({ ...data }, id)

    await this.prisma.chat.create({
      data: PrismaGroupChatMapper.toPrismaCreate(chat),
    })

    return chat
  }
}
