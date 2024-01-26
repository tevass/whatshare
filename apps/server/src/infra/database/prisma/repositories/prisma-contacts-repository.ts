import {
  ContactsRepository,
  CountManyParams,
  FindByWAContactIdParams,
  FindManyByWAContactsIdsParams,
  FindManyParams,
} from '@/domain/chat/application/repositories/contacts-repository'
import { Contact } from '@/domain/chat/enterprise/entities/contact'
import { PrismaService } from '../prisma.service'
import { Prisma } from '@prisma/client'
import { PrismaContactMapper } from '../mappers/prisma-contact-mapper'
import { Injectable } from '@nestjs/common'
import { Pagination } from '@/domain/shared/enterprise/utilities/pagination'

@Injectable()
export class PrismaContactsRepository implements ContactsRepository {
  constructor(private prisma: PrismaService) {}

  private resolveWhere<Method extends { where?: object }>(
    where: Method['where'],
    findUnknown: boolean = false,
  ) {
    return {
      ...where,
      ...(!findUnknown && {
        isMyContact: true,
      }),
    }
  }

  async findByWAContactId(
    params: FindByWAContactIdParams,
  ): Promise<Contact | null> {
    const { waContactId, includeUnknowns } = params

    const raw = await this.prisma.contact.findUnique({
      where: this.resolveWhere<Prisma.ContactFindUniqueArgs>(
        {
          waContactId: waContactId.toString(),
        },
        includeUnknowns,
      ),
    })

    if (!raw) return null

    return PrismaContactMapper.toDomain(raw)
  }

  async findManyByWAContactsIds(
    params: FindManyByWAContactsIdsParams,
  ): Promise<Contact[]> {
    const { waContactsIds, includeUnknowns } = params

    const raw = await this.prisma.contact.findMany({
      where: this.resolveWhere<Prisma.ContactFindManyArgs>(
        {
          waContactId: {
            in: waContactsIds.map((id) => id.toString()),
          },
        },
        includeUnknowns,
      ),
    })

    return raw.map(PrismaContactMapper.toDomain)
  }

  async findMany(params: FindManyParams): Promise<Contact[]> {
    const { page, take, includeUnknowns, query } = params

    const raw = await this.prisma.contact.findMany({
      where: this.resolveWhere<Prisma.ContactFindManyArgs>(
        {
          ...(query && {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          }),
        },
        includeUnknowns,
      ),
      take,
      skip: Pagination.skip({ limit: take, page }),
    })

    return raw.map(PrismaContactMapper.toDomain)
  }

  async countMany(params: CountManyParams): Promise<number> {
    const { includeUnknowns, query } = params

    const rows = await this.prisma.contact.count({
      where: this.resolveWhere<Prisma.ContactCountArgs>(
        {
          ...(query && {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          }),
        },
        includeUnknowns,
      ),
    })

    return rows
  }

  async create(contact: Contact): Promise<void> {
    const data = PrismaContactMapper.toPrismaCreate(contact)

    await this.prisma.contact.create({
      data,
    })
  }

  async createMany(contact: Contact[]): Promise<void> {
    const data = contact.map(PrismaContactMapper.toPrismaCreate)

    await this.prisma.contact.createMany({
      data,
    })
  }
}
