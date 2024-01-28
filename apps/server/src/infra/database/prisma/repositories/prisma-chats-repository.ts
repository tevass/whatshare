import {
  ChatsRepository,
  ChatsRepositoryCountManyByWhatsAppIdParams,
  ChatsRepositoryFilters,
  ChatsRepositoryFindByWAChatIdAndWhatsAppIdParams,
  ChatsRepositoryFindManyByWAChatsIdsParams,
  ChatsRepositoryFindManyByWhatsAppIdParams,
} from '@/domain/chat/application/repositories/chats-repository'
import { Chat } from '@/domain/chat/enterprise/entities/chat'
import { Pagination } from '@/domain/shared/enterprise/utilities/pagination'
import { TypeGuards } from '@/infra/utils/type-guards'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaChatMapper } from '../mappers/prisma-chat-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaChatsRepository implements ChatsRepository {
  constructor(private prisma: PrismaService) {}

  private resolveFilters<Method extends { where?: object }>(
    where: Method['where'],
    filters: ChatsRepositoryFilters = {},
  ) {
    const { deleted } = filters

    return {
      ...where,
      ...(TypeGuards.isNotUndefined(deleted) &&
        !deleted && { deletedAt: null }),
    }
  }

  private aggregate = {
    contact: true,
    lastMessage: true,
  }

  async findManyByWhatsAppId(
    params: ChatsRepositoryFindManyByWhatsAppIdParams,
  ): Promise<Chat[]> {
    const { page, take, whatsAppId, ...filters } = params

    const raw = await this.prisma.chat.findMany({
      where: this.resolveFilters<Prisma.ChatFindManyArgs>(
        {
          whatsAppId,
        },
        filters,
      ),
      take,
      skip: Pagination.skip({ limit: take, page }),
      include: this.aggregate,
    })

    return raw.map(PrismaChatMapper.toDomain)
  }

  async countManyByWhatsAppId(
    params: ChatsRepositoryCountManyByWhatsAppIdParams,
  ): Promise<number> {
    const { whatsAppId, ...filters } = params

    const rows = await this.prisma.chat.count({
      where: this.resolveFilters<Prisma.ChatCountArgs>(
        {
          whatsAppId,
        },
        filters,
      ),
    })

    return rows
  }

  async findByWAChatIdAndWhatsAppId(
    params: ChatsRepositoryFindByWAChatIdAndWhatsAppIdParams,
  ): Promise<Chat | null> {
    const { waChatId, whatsAppId } = params

    const raw = await this.prisma.chat.findUnique({
      where: {
        waChatId_whatsAppId: {
          whatsAppId,
          waChatId: waChatId.toString(),
        },
      },
      include: this.aggregate,
    })

    if (!raw) return null

    return PrismaChatMapper.toDomain(raw)
  }

  async findManyByWAChatsIds(
    params: ChatsRepositoryFindManyByWAChatsIdsParams,
  ): Promise<Chat[]> {
    const { waChatsIds } = params

    const raw = await this.prisma.chat.findMany({
      where: {
        waChatId: {
          in: waChatsIds.map((id) => id.toString()),
        },
      },
      include: this.aggregate,
    })

    return raw.map(PrismaChatMapper.toDomain)
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

  async softDelete(chat: Chat): Promise<void> {
    chat.clear()
    const data = PrismaChatMapper.toPrismaUpdate(chat)

    await this.prisma.chat.update({
      data,
      where: {
        id: chat.id.toString(),
      },
    })
  }

  async create(chat: Chat): Promise<void> {
    const data = PrismaChatMapper.toPrismaCreate(chat)

    await this.prisma.chat.create({
      data,
    })
  }

  async createMany(chats: Chat[]): Promise<void> {
    const data = chats.map(PrismaChatMapper.toPrismaCreate)

    await this.prisma.chat.createMany({
      data,
    })
  }
}
