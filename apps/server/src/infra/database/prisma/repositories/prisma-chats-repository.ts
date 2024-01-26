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
import { Prisma } from '@prisma/client'
import { Pagination } from '@/domain/shared/enterprise/utilities/pagination'

@Injectable()
export class PrismaChatsRepository implements ChatsRepository {
  constructor(private prisma: PrismaService) {}

  private resolveWhere<Method extends { where?: object }>(
    where: Method['where'] = {},
    findDeleted: boolean = false,
  ) {
    return {
      ...where,
      ...(!findDeleted && {
        deletedAt: null,
      }),
    }
  }

  private aggregate = {
    contact: true,
    lastMessage: true,
  }

  async findManyByWhatsAppId(
    params: FindManyByWhatsAppIdParams,
  ): Promise<Chat[]> {
    const { page, take, whatsAppId, findDeleted } = params

    const raw = await this.prisma.chat.findMany({
      where: this.resolveWhere<Prisma.ChatFindManyArgs>(
        {
          whatsAppId,
        },
        findDeleted,
      ),
      take,
      skip: Pagination.skip({ limit: take, page }),
      include: this.aggregate,
    })

    return raw.map(PrismaChatMapper.toDomain)
  }

  async countManyByWhatsAppId(
    params: CountManyByWhatsAppIdParams,
  ): Promise<number> {
    const { whatsAppId, findDeleted } = params

    const rows = await this.prisma.chat.count({
      where: this.resolveWhere<Prisma.ChatCountArgs>(
        {
          whatsAppId,
        },
        findDeleted,
      ),
    })

    return rows
  }

  async findByWAChatIdAndWhatsAppId(
    params: FindByWAChatIdAndWhatsAppIdParams,
  ): Promise<Chat | null> {
    const { waChatId, whatsAppId, findDeleted } = params

    const raw = await this.prisma.chat.findUnique({
      where: this.resolveWhere<Prisma.ChatFindUniqueArgs>(
        {
          waChatId_whatsAppId: {
            whatsAppId,
            waChatId: waChatId.toString(),
          },
        },
        findDeleted,
      ),
      include: this.aggregate,
    })

    if (!raw) return null

    return PrismaChatMapper.toDomain(raw)
  }

  async findManyByWAChatsIds(
    params: FindManyByWAChatsIdsParams,
  ): Promise<Chat[]> {
    const { waChatsIds, findDeleted } = params

    const raw = await this.prisma.chat.findMany({
      where: this.resolveWhere<Prisma.ChatFindManyArgs>(
        {
          waChatId: {
            in: waChatsIds.map((id) => id.toString()),
          },
        },
        findDeleted,
      ),
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
