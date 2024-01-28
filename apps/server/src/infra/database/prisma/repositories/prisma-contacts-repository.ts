import {
  ContactsRepository,
  ContactsRepositoryCountManyParams,
  ContactsRepositoryFilters,
  ContactsRepositoryFindByPhoneParams,
  ContactsRepositoryFindByWAContactIdParams,
  ContactsRepositoryFindManyByWAContactsIdsParams,
  ContactsRepositoryFindManyParams,
} from '@/domain/chat/application/repositories/contacts-repository'
import { Contact } from '@/domain/chat/enterprise/entities/contact'
import { Pagination } from '@/domain/shared/enterprise/utilities/pagination'
import { TypeGuards } from '@/infra/utils/type-guards'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaContactMapper } from '../mappers/prisma-contact-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaContactsRepository implements ContactsRepository {
  constructor(private prisma: PrismaService) {}

  private resolveFilters<Method extends { where?: object }>(
    where: Method['where'],
    filters: ContactsRepositoryFilters = {},
  ) {
    const { isGroup, isMyContact } = filters

    return {
      ...where,
      ...(TypeGuards.isNotUndefined(isGroup) && { isGroup }),
      ...(TypeGuards.isNotUndefined(isMyContact) && { isMyContact }),
    }
  }

  async findByPhone(
    params: ContactsRepositoryFindByPhoneParams,
  ): Promise<Contact | null> {
    const { phone } = params

    const raw = await this.prisma.contact.findUnique({
      where: {
        phone,
      },
    })

    if (!raw) return null

    return PrismaContactMapper.toDomain(raw)
  }

  async findByWAContactId(
    params: ContactsRepositoryFindByWAContactIdParams,
  ): Promise<Contact | null> {
    const { waContactId } = params

    const raw = await this.prisma.contact.findUnique({
      where: {
        waContactId: waContactId.toString(),
      },
    })

    if (!raw) return null

    return PrismaContactMapper.toDomain(raw)
  }

  async findManyByWAContactsIds(
    params: ContactsRepositoryFindManyByWAContactsIdsParams,
  ): Promise<Contact[]> {
    const { waContactsIds } = params

    const raw = await this.prisma.contact.findMany({
      where: {
        waContactId: {
          in: waContactsIds.map((id) => id.toString()),
        },
      },
    })

    return raw.map(PrismaContactMapper.toDomain)
  }

  async findMany(params: ContactsRepositoryFindManyParams): Promise<Contact[]> {
    const { page, take, query, ...filters } = params

    const raw = await this.prisma.contact.findMany({
      where: this.resolveFilters<Prisma.ContactFindManyArgs>(
        {
          ...(query && {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          }),
        },
        filters,
      ),
      take,
      skip: Pagination.skip({ limit: take, page }),
    })

    return raw.map(PrismaContactMapper.toDomain)
  }

  async countMany(params: ContactsRepositoryCountManyParams): Promise<number> {
    const { query, ...filters } = params

    const rows = await this.prisma.contact.count({
      where: this.resolveFilters<Prisma.ContactCountArgs>(
        {
          ...(query && {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          }),
        },
        filters,
      ),
    })

    return rows
  }

  async save(contact: Contact): Promise<void> {
    const data = PrismaContactMapper.toPrismaUpdate(contact)

    await this.prisma.contact.update({
      data,
      where: {
        id: contact.id.toString(),
      },
    })
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
