import { FetchContactsUseCase } from '@/domain/chat/application/use-cases/contacts/fetch-contacts-use-case'
import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import { ZodHttpValidationPipe } from '../../pipes/zod-http-validation-pipe'

import {
  FetchContactsRequestQuerySchema,
  fetchContactsRequestQuerySchema,
} from '@whatshare/http-schemas/request'
import { FetchContactsResponseBodySchema } from '@whatshare/http-schemas/response'
import { ContactPresenter } from '@/infra/presenters/contact-presenter'
import { PaginationPresenter } from '@/infra/presenters/pagination-presenter'

const queryValidationPipe = new ZodHttpValidationPipe(
  fetchContactsRequestQuerySchema,
)

@Controller('/contacts')
export class FetchContactsController {
  constructor(private fetchContacts: FetchContactsUseCase) {}

  @Get()
  async handle(
    @Query(queryValidationPipe) query: FetchContactsRequestQuerySchema,
  ): Promise<FetchContactsResponseBodySchema> {
    const { page, query: searchableQuery } = query

    const result = await this.fetchContacts.execute({
      page,
      query: searchableQuery,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { contacts, pagination } = result.value

    return {
      contacts: contacts.map(ContactPresenter.toHttp),
      pagination: PaginationPresenter.toHttp(pagination),
    }
  }
}
