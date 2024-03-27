import { Either, right } from '@/core/either'
import { Contact } from '@/domain/chat/enterprise/entities/contact'
import { PaginationRequest } from '@/domain/shared/application/use-cases/pagination-request'
import { SearchRequest } from '@/domain/shared/application/use-cases/search-request'
import { Pagination } from '@/domain/shared/enterprise/utilities/pagination'
import { Injectable } from '@nestjs/common'
import { ContactsRepository } from '../../repositories/contacts-repository'

interface FetchContactsUseCaseRequest
  extends PaginationRequest,
    SearchRequest {}

type FetchContactsUseCaseResponse = Either<
  null,
  {
    contacts: Contact[]
    pagination: Pagination
  }
>

@Injectable()
export class FetchContactsUseCase {
  constructor(private contactsRepository: ContactsRepository) {}

  async execute(
    request: FetchContactsUseCaseRequest,
  ): Promise<FetchContactsUseCaseResponse> {
    const { page, query } = request

    const limit = Pagination.limit()

    const [rows, contacts] = await Promise.all([
      this.contactsRepository.countMany({
        query,
        isMyContact: true,
      }),
      this.contactsRepository.findMany({
        page,
        take: limit,
        query,
        isMyContact: true,
      }),
    ])

    const pagination = Pagination.create({ limit, page, rows })

    return right({
      contacts,
      pagination,
    })
  }
}
