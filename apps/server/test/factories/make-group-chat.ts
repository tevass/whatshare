import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  GroupChat,
  GroupChatProps,
} from '@/domain/chat/enterprise/entities/group-chat'
import { PrismaChatMapper } from '@/infra/database/prisma/mappers/prisma-chat-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
import { FakeContactFactory, makeContact } from './make-contact'
import { makeUniqueEntityID } from './make-unique-entity-id'
import { makeWAEntityID } from './make-wa-entity-id'

export const makeGroupChat = (
  override: Partial<GroupChatProps> = {},
  id?: UniqueEntityID,
) => {
  return GroupChat.create(
    {
      contact: makeContact(),
      unreadCount: faker.number.int({ max: 99 }),
      whatsAppId: makeUniqueEntityID(),
      waChatId: makeWAEntityID(),
      participants: Array.from(Array(2)).map(() => makeContact()),
      ...override,
    },
    id,
  )
}

// TODO: REFACTOR
@Injectable()
export class FakeChatFactory {
  constructor(
    private prisma: PrismaService,
    private fakeContact: FakeContactFactory,
  ) {}

  async makePrismaChat(
    data: Partial<GroupChatProps> = {},
    id?: UniqueEntityID,
  ): Promise<GroupChat> {
    const contact = data.contact ?? (await this.fakeContact.makePrismaContact())

    const chat = makeGroupChat({ ...data, contact }, id)

    await this.prisma.chat.create({
      data: PrismaChatMapper.toPrismaCreate(chat),
    })

    return chat
  }
}
