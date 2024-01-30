import { FetchChatsUseCase } from '@/domain/chat/application/use-cases/chats/fetch-chats-use-case'
import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import { ZodHttpValidationPipe } from '../../pipes/zod-http-validation-pipe'

import {
  FetchChatsRequestQuerySchema,
  fetchChatsRequestQuerySchema,
} from '@whatshare/http-schemas/request'
import { FetchChatsResponseBodySchema } from '@whatshare/http-schemas/response'
import { ChatPresenter } from '@/infra/presenters/chat-presenter'
import { PaginationPresenter } from '@/infra/presenters/pagination-presenter'

const queryValidationPipe = new ZodHttpValidationPipe(
  fetchChatsRequestQuerySchema,
)

@Controller('/wa/chats')
export class FetchChatsController {
  constructor(private fetchChats: FetchChatsUseCase) {}

  @Get()
  async handle(
    @Query(queryValidationPipe) query: FetchChatsRequestQuerySchema,
  ): Promise<FetchChatsResponseBodySchema> {
    const { page, whatsAppId } = query

    const result = await this.fetchChats.execute({
      page,
      whatsAppId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { chats, pagination } = result.value

    return {
      chats: chats.map(ChatPresenter.toHttp),
      pagination: PaginationPresenter.toHttp(pagination),
    }
  }
}
