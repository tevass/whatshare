import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Chat, ChatProps } from '@/domain/chat/enterprise/entities/chat'
import { PrismaChatMapper } from '@/infra/database/prisma/mappers/prisma-chat-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
import { FakeContactFactory, makeContact } from './make-contact'
import { makeUniqueEntityID } from './make-unique-entity-id'
import { makeWAEntityID } from './make-wa-entity-id'

export const makeChat = (
  override: Partial<ChatProps> = {},
  id?: UniqueEntityID,
) => {
  return Chat.create(
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

@Injectable()
export class FakeChatFactory {
  constructor(
    private prisma: PrismaService,
    private fakeContact: FakeContactFactory,
  ) {}

  async makePrismaChat(
    data: Partial<ChatProps> = {},
    id?: UniqueEntityID,
  ): Promise<Chat> {
    const contact = data.contact ?? (await this.fakeContact.makePrismaContact())

    const chat = makeChat({ ...data, contact }, id)

    await this.prisma.chat.create({
      data: PrismaChatMapper.toPrismaCreate(chat),
    })

    return chat
  }
}
