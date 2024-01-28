import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'

import {
  MessagesRepository,
  MessagesRepositoryCountManyByChatIdParams,
  MessagesRepositoryDeleteManyByChatIdParams,
  MessagesRepositoryFilters,
  MessagesRepositoryFindByIdParams,
  MessagesRepositoryFindByWAMessageIdParams,
  MessagesRepositoryFindManyByChatIdParams,
  MessagesRepositoryFindManyByWAMessagesIdsParams,
  MessagesRepositoryFindToRevokeParams,
} from '@/domain/chat/application/repositories/messages-repository'
import { Message } from '@/domain/chat/enterprise/entities/message'
import { Pagination } from '@/domain/shared/enterprise/utilities/pagination'
import { TypeGuards } from '@/infra/utils/type-guards'
import { PrismaMessageMapper } from '../mappers/prisma-message-mapper'

@Injectable()
export class PrismaMessagesRepository implements MessagesRepository {
  constructor(private prisma: PrismaService) {}

  private resolveFilters<Method extends { where?: object }>(
    where: Method['where'],
    filters: MessagesRepositoryFilters = {},
  ) {
    const { deleted } = filters

    return {
      ...where,
      ...(TypeGuards.isNotUndefined(deleted) &&
        !deleted && { deletedAt: null }),
    }
  }

  private aggregate = {
    author: true,
    media: {
      include: {
        message: {
          select: { id: true },
        },
      },
    },
    quoted: true,
    vCardsContacts: true,
    revokedBy: true,
    senderBy: true,
  }

  async findById(
    params: MessagesRepositoryFindByIdParams,
  ): Promise<Message | null> {
    const { id } = params

    const raw = await this.prisma.message.findUnique({
      where: {
        id,
      },
      include: this.aggregate,
    })

    if (!raw) return null

    return PrismaMessageMapper.toDomain(raw)
  }

  async findManyByChatId(
    params: MessagesRepositoryFindManyByChatIdParams,
  ): Promise<Message[]> {
    const { chatId, page, take, ...filters } = params

    const raw = await this.prisma.message.findMany({
      where: this.resolveFilters(
        {
          chatId,
        },
        filters,
      ),
      take,
      skip: Pagination.skip({ limit: take, page }),
      include: this.aggregate,
    })

    return raw.map(PrismaMessageMapper.toDomain)
  }

  async countManyByChatId(
    params: MessagesRepositoryCountManyByChatIdParams,
  ): Promise<number> {
    const { chatId, ...filters } = params

    const rows = await this.prisma.message.count({
      where: this.resolveFilters(
        {
          chatId,
        },
        filters,
      ),
    })

    return rows
  }

  async findByWAMessageId(
    params: MessagesRepositoryFindByWAMessageIdParams,
  ): Promise<Message | null> {
    const { waMessageId } = params

    const raw = await this.prisma.message.findUnique({
      where: {
        waMessageId: waMessageId.toString(),
      },
      include: this.aggregate,
    })

    if (!raw) return null

    return PrismaMessageMapper.toDomain(raw)
  }

  async findManyByWAMessagesIds(
    params: MessagesRepositoryFindManyByWAMessagesIdsParams,
  ): Promise<Message[]> {
    const { waMessagesIds } = params

    const raw = await this.prisma.message.findMany({
      where: {
        waMessageId: {
          in: waMessagesIds.map((id) => id.toString()),
        },
      },
      include: this.aggregate,
    })

    return raw.map(PrismaMessageMapper.toDomain)
  }

  async findToRevoke(
    params: MessagesRepositoryFindToRevokeParams,
  ): Promise<Message | null> {
    const { createdAt, waChatId, whatsAppId } = params

    const raw = await this.prisma.message.findUnique({
      where: {
        waChatId_whatsAppId_createdAt: {
          waChatId: waChatId.toString(),
          whatsAppId,
          createdAt,
        },
      },
      include: this.aggregate,
    })

    if (!raw) return null

    return PrismaMessageMapper.toDomain(raw)
  }

  async save(message: Message): Promise<void> {
    const data = PrismaMessageMapper.toPrismaUpdate(message)

    await this.prisma.message.update({
      data,
      where: {
        id: message.id.toString(),
      },
    })
  }

  async softDeleteManyByChatId(
    params: MessagesRepositoryDeleteManyByChatIdParams,
  ): Promise<void> {
    const { chatId } = params

    await this.prisma.message.updateMany({
      data: {
        deletedAt: new Date(),
      },
      where: {
        chatId,
      },
    })
  }

  async create(message: Message): Promise<void> {
    const data = PrismaMessageMapper.toPrismaCreate(message)

    await this.prisma.message.create({
      data,
    })
  }
}
