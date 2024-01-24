import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Chat, ChatProps } from '@/domain/chat/enterprise/entities/chat'
import { faker } from '@faker-js/faker'
import { makeContact } from './make-contact'
import { makeUniqueEntityID } from './make-unique-entity-id'
import { makeWAEntityID } from './make-wa-entity-id'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaChatMapper } from '@/infra/database/prisma/mappers/prisma-chat-mapper'

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
  constructor(private prisma: PrismaService) {}

  async makePrismaChat(
    data: Partial<ChatProps> = {},
    id?: UniqueEntityID,
  ): Promise<Chat> {
    const chat = makeChat(data, id)

    await this.prisma.chat.create({
      data: PrismaChatMapper.toPrismaCreate(chat),
    })

    return chat
  }
}
