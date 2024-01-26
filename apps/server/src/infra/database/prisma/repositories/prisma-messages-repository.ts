import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'

import {
  CountManyByChatIdParams,
  FindAllByChatIdParams,
  FindByIdParams,
  FindByWAMessageIdParams,
  FindManyByChatIdParams,
  FindManyByWAMessagesIdsParams,
  FindToRevokeParams,
  MessagesRepository,
} from '@/domain/chat/application/repositories/messages-repository'
import { Message } from '@/domain/chat/enterprise/entities/message'
import { Prisma } from '@prisma/client'
import { PrismaMessageMapper } from '../mappers/prisma-message-mapper'
import { Pagination } from '@/domain/shared/enterprise/utilities/pagination'

@Injectable()
export class PrismaMessagesRepository implements MessagesRepository {
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

  async findById(params: FindByIdParams): Promise<Message | null> {
    const { id, findDeleted } = params

    const raw = await this.prisma.message.findUnique({
      where: this.resolveWhere<Prisma.MessageFindUniqueArgs>(
        {
          id,
        },
        findDeleted,
      ),
      include: this.aggregate,
    })

    if (!raw) return null

    return PrismaMessageMapper.toDomain(raw)
  }

  async findManyByChatId(params: FindManyByChatIdParams): Promise<Message[]> {
    const { chatId, page, take, findDeleted } = params

    const raw = await this.prisma.message.findMany({
      where: this.resolveWhere<Prisma.MessageFindManyArgs>(
        {
          chatId,
        },
        findDeleted,
      ),
      take,
      skip: Pagination.skip({ limit: take, page }),
      include: this.aggregate,
    })

    return raw.map(PrismaMessageMapper.toDomain)
  }

  async countManyByChatId(params: CountManyByChatIdParams): Promise<number> {
    const { chatId, findDeleted } = params

    const rows = await this.prisma.message.count({
      where: this.resolveWhere<Prisma.MessageCountArgs>(
        {
          chatId,
        },
        findDeleted,
      ),
    })

    return rows
  }

  async findAllByChatId(params: FindAllByChatIdParams): Promise<Message[]> {
    const { chatId, findDeleted } = params

    const raw = await this.prisma.message.findMany({
      where: this.resolveWhere<Prisma.MessageFindManyArgs>(
        {
          chatId,
        },
        findDeleted,
      ),
      include: this.aggregate,
    })

    return raw.map(PrismaMessageMapper.toDomain)
  }

  async findByWAMessageId(
    params: FindByWAMessageIdParams,
  ): Promise<Message | null> {
    const { waMessageId, findDeleted } = params

    const raw = await this.prisma.message.findUnique({
      where: this.resolveWhere<Prisma.MessageFindUniqueArgs>(
        { waMessageId: waMessageId.toString() },
        findDeleted,
      ),
      include: this.aggregate,
    })

    if (!raw) return null

    return PrismaMessageMapper.toDomain(raw)
  }

  async findManyByWAMessagesIds(
    params: FindManyByWAMessagesIdsParams,
  ): Promise<Message[]> {
    const { waMessagesIds, findDeleted } = params

    const raw = await this.prisma.message.findMany({
      where: this.resolveWhere<Prisma.MessageFindManyArgs>(
        {
          waMessageId: {
            in: waMessagesIds.map((id) => id.toString()),
          },
        },
        findDeleted,
      ),
      include: this.aggregate,
    })

    return raw.map(PrismaMessageMapper.toDomain)
  }

  async findToRevoke(params: FindToRevokeParams): Promise<Message | null> {
    const { createdAt, waChatId, whatsAppId, findDeleted } = params

    const raw = await this.prisma.message.findUnique({
      where: this.resolveWhere<Prisma.MessageFindUniqueArgs>(
        {
          waChatId_whatsAppId_createdAt: {
            waChatId: waChatId.toString(),
            whatsAppId,
            createdAt,
          },
        },
        findDeleted,
      ),
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

  async saveMany(messages: Message[]): Promise<void> {
    const data = messages.map(PrismaMessageMapper.toPrismaUpdate)

    await this.prisma.message.updateMany({
      data,
    })
  }

  async create(message: Message): Promise<void> {
    const data = PrismaMessageMapper.toPrismaCreate(message)

    await this.prisma.message.create({
      data,
    })
  }
}
