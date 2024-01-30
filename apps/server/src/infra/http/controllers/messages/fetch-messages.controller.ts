import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import { ZodHttpValidationPipe } from '../../pipes/zod-http-validation-pipe'
import { FetchMessagesUseCase } from '@/domain/chat/application/use-cases/messages/fetch-messages-use-case'
import {
  fetchMessagesRequestQuerySchema,
  FetchMessagesRequestQuerySchema,
} from '@whatshare/http-schemas/request'
import { FetchMessagesResponseBodySchema } from '@whatshare/http-schemas/response'
import { MessagePresenter } from '@/infra/presenters/message-presenter'
import { PaginationPresenter } from '@/infra/presenters/pagination-presenter'

const queryValidationPipe = new ZodHttpValidationPipe(
  fetchMessagesRequestQuerySchema,
)

@Controller('/wa/messages')
export class FetchMessagesController {
  constructor(private fetchMessages: FetchMessagesUseCase) {}

  @Get()
  async handle(
    @Query(queryValidationPipe) query: FetchMessagesRequestQuerySchema,
  ): Promise<FetchMessagesResponseBodySchema> {
    const { chatId, page } = query

    const result = await this.fetchMessages.execute({
      chatId,
      page,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { messages, pagination } = result.value

    return {
      messages: messages.map(MessagePresenter.toHttp),
      pagination: PaginationPresenter.toHttp(pagination),
    }
  }
}
