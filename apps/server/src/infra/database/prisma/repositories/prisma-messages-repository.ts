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

@Injectable()
export class PrismaMessagesRepository implements MessagesRepository {
  constructor(private prisma: PrismaService) {}

  private resolveWhere<Where>(where: Where, findDeleted: boolean = false) {
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

  findById(params: FindByIdParams): Promise<Message | null> {
    throw new Error('Method not implemented.')
  }

  findManyByChatId(params: FindManyByChatIdParams): Promise<Message[]> {
    throw new Error('Method not implemented.')
  }

  countManyByChatId(params: CountManyByChatIdParams): Promise<number> {
    throw new Error('Method not implemented.')
  }

  findAllByChatId(params: FindAllByChatIdParams): Promise<Message[]> {
    throw new Error('Method not implemented.')
  }

  async findByWAMessageId(
    params: FindByWAMessageIdParams,
  ): Promise<Message | null> {
    const { waMessageId, findDeleted } = params

    const raw = await this.prisma.message.findUnique({
      where: this.resolveWhere<Prisma.MessageFindUniqueArgs['where']>(
        { waMessageId: waMessageId.toString() },
        findDeleted,
      ),
      include: this.aggregate,
    })

    if (!raw) return null

    return PrismaMessageMapper.toDomain(raw)
  }

  findManyByWAMessagesIds(
    params: FindManyByWAMessagesIdsParams,
  ): Promise<Message[]> {
    throw new Error('Method not implemented.')
  }

  findToRevoke(params: FindToRevokeParams): Promise<Message | null> {
    throw new Error('Method not implemented.')
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

  saveMany(messages: Message[]): Promise<void> {
    throw new Error('Method not implemented.')
  }

  create(message: Message): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
