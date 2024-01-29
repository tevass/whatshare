import { FetchChatsUseCase } from '@/domain/chat/application/use-cases/chats/fetch-chats-use-case'
import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UsePipes,
} from '@nestjs/common'
import { ZodHttpValidationPipe } from '../../pipes/zod-http-validation-pipe'

import {
  FetchChatsRequestQuerySchema,
  fetchChatsRequestQuerySchema,
} from '@whatshare/http-schemas/request'
import { FetchChatsResponseBodySchema } from '@whatshare/http-schemas/response'
import { ChatPresenter } from '@/infra/presenters/chat-presenter'
import { PaginationPresenter } from '@/infra/presenters/pagination-presenter'

@Controller('/wa/chats')
export class FetchChatsController {
  constructor(private fetchChats: FetchChatsUseCase) {}

  @Get()
  @UsePipes(new ZodHttpValidationPipe(fetchChatsRequestQuerySchema))
  async handle(@Query() query: FetchChatsRequestQuerySchema) {
    const { page, whatsAppId } = query

    const response = await this.fetchChats.execute({
      page,
      whatsAppId,
    })

    if (response.isLeft()) {
      throw new BadRequestException()
    }

    const { chats, pagination } = response.value

    return {
      chats: chats.map(ChatPresenter.toHttp),
      pagination: PaginationPresenter.toHttp(pagination),
    } as FetchChatsResponseBodySchema
  }
}
