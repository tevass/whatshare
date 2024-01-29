import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UsePipes,
} from '@nestjs/common'
import { ZodHttpValidationPipe } from '../../pipes/zod-http-validation-pipe'
import { FetchMessagesUseCase } from '@/domain/chat/application/use-cases/messages/fetch-messages-use-case'
import {
  fetchMessagesRequestQuerySchema,
  FetchMessagesRequestQuerySchema,
} from '@whatshare/http-schemas/request'
import { FetchMessagesResponseBodySchema } from '@whatshare/http-schemas/response'
import { MessagePresenter } from '@/infra/presenters/message-presenter'
import { PaginationPresenter } from '@/infra/presenters/pagination-presenter'

@Controller('/wa/messages')
export class FetchMessagesController {
  constructor(private fetchMessages: FetchMessagesUseCase) {}

  @Get()
  @UsePipes(new ZodHttpValidationPipe(fetchMessagesRequestQuerySchema))
  async handle(@Query() query: FetchMessagesRequestQuerySchema) {
    const { chatId, page } = query

    const response = await this.fetchMessages.execute({
      chatId,
      page,
    })

    if (response.isLeft()) {
      throw new BadRequestException()
    }

    const { messages, pagination } = response.value

    return {
      messages: messages.map(MessagePresenter.toHttp),
      pagination: PaginationPresenter.toHttp(pagination),
    } as FetchMessagesResponseBodySchema
  }
}
