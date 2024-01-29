import { FetchContactsUseCase } from '@/domain/chat/application/use-cases/contacts/fetch-contacts-use-case'
import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UsePipes,
} from '@nestjs/common'
import { ZodHttpValidationPipe } from '../../pipes/zod-http-validation-pipe'

import {
  FetchContactsRequestQuerySchema,
  fetchContactsRequestQuerySchema,
} from '@whatshare/http-schemas/request'
import { FetchContactsResponseBodySchema } from '@whatshare/http-schemas/response'
import { ContactPresenter } from '@/infra/presenters/contact-presenter'
import { PaginationPresenter } from '@/infra/presenters/pagination-presenter'

@Controller('/contacts')
export class FetchContactsController {
  constructor(private fetchContacts: FetchContactsUseCase) {}

  @Get()
  @UsePipes(new ZodHttpValidationPipe(fetchContactsRequestQuerySchema))
  async handle(
    @Query() query: FetchContactsRequestQuerySchema,
  ): Promise<FetchContactsResponseBodySchema> {
    const { page, query: searchableQuery } = query

    const response = await this.fetchContacts.execute({
      page,
      query: searchableQuery,
    })

    if (response.isLeft()) {
      throw new BadRequestException()
    }

    const { contacts, pagination } = response.value

    return {
      contacts: contacts.map(ContactPresenter.toHttp),
      pagination: PaginationPresenter.toHttp(pagination),
    }
  }
}
