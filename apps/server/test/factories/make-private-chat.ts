import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  PrivateChat,
  PrivateChatProps,
} from '@/domain/chat/enterprise/entities/private-chat'
import { PrismaChatMapper } from '@/infra/database/prisma/mappers/prisma-chat-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
import { FakeContactFactory, makeContact } from './make-contact'
import { makeUniqueEntityID } from './make-unique-entity-id'
import { makeWAEntityID } from './make-wa-entity-id'

export const makePrivateChat = (
  override: Partial<PrivateChatProps> = {},
  id?: UniqueEntityID,
) => {
  return PrivateChat.create(
    {
      contact: makeContact(),
      unreadCount: faker.number.int({ max: 99 }),
      whatsAppId: makeUniqueEntityID(),
      waChatId: makeWAEntityID(),
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
    data: Partial<PrivateChatProps> = {},
    id?: UniqueEntityID,
  ): Promise<PrivateChat> {
    const contact = data.contact ?? (await this.fakeContact.makePrismaContact())

    const chat = makePrivateChat({ ...data, contact }, id)

    await this.prisma.chat.create({
      data: PrismaChatMapper.toPrismaCreate(chat),
    })

    return chat
  }
}
