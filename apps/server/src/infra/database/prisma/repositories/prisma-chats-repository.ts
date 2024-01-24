import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import {
  ChatsRepository,
  CountManyByWhatsAppIdParams,
  FindByWAChatIdAndWhatsAppIdParams,
  FindManyByWAChatsIdsParams,
  FindManyByWhatsAppIdParams,
} from '@/domain/chat/application/repositories/chats-repository'
import { Chat } from '@/domain/chat/enterprise/entities/chat'
import { PrismaChatMapper } from '../mappers/prisma-chat-mapper'

@Injectable()
export class PrismaChatsRepository implements ChatsRepository {
  constructor(private prisma: PrismaService) {}

  private getDeletedWhere = (include: boolean) => {
    return {
      ...(include && {
        deletedAt: {
          not: null,
        },
      }),
    }
  }

  findManyByWhatsAppId(params: FindManyByWhatsAppIdParams): Promise<Chat[]> {
    throw new Error('Method not implemented.')
  }

  countManyByWhatsAppId(params: CountManyByWhatsAppIdParams): Promise<number> {
    throw new Error('Method not implemented.')
  }

  async findByWAChatIdAndWhatsAppId(
    params: FindByWAChatIdAndWhatsAppIdParams,
  ): Promise<Chat | null> {
    const { waChatId, whatsAppId, includeDeleted = false } = params

    const raw = await this.prisma.chat.findUnique({
      where: {
        waChatId_whatsAppId: {
          whatsAppId,
          waChatId: waChatId.toString(),
        },
        ...this.getDeletedWhere(includeDeleted),
      },
      include: {
        contact: true,
      },
    })

    if (!raw) return null

    return PrismaChatMapper.toDomain(raw)
  }

  findManyByWAChatsIds(params: FindManyByWAChatsIdsParams): Promise<Chat[]> {
    throw new Error('Method not implemented.')
  }

  async save(chat: Chat): Promise<void> {
    const data = PrismaChatMapper.toPrismaUpdate(chat)

    await this.prisma.chat.update({
      data,
      where: {
        id: chat.id.toString(),
      },
    })
  }

  create(chat: Chat): Promise<void> {
    throw new Error('Method not implemented.')
  }

  createMany(chats: Chat[]): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
