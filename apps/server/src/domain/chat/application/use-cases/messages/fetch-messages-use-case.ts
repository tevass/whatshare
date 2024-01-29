import { Either, right } from '@/core/either'
import { Message } from '@/domain/chat/enterprise/entities/message'
import { PaginationRequest } from '@/domain/shared/application/use-cases/pagination-request'
import { Pagination } from '@/domain/shared/enterprise/utilities/pagination'
import { MessagesRepository } from '../../repositories/messages-repository'
import { Injectable } from '@nestjs/common'

interface FetchMessagesUseCaseRequest extends PaginationRequest {
  chatId: string
}

type FetchMessagesUseCaseResponse = Either<
  null,
  {
    messages: Message[]
    pagination: Pagination
  }
>

@Injectable()
export class FetchMessagesUseCase {
  constructor(private messagesRepository: MessagesRepository) {}

  async execute(
    request: FetchMessagesUseCaseRequest,
  ): Promise<FetchMessagesUseCaseResponse> {
    const { chatId, page } = request

    const limit = Pagination.limit(100)

    const filters = {
      deleted: false,
    }

    const [rows, messages] = await Promise.all([
      this.messagesRepository.countManyByChatId({ chatId, ...filters }),
      this.messagesRepository.findManyByChatId({
        chatId,
        page,
        take: limit,
        ...filters,
      }),
    ])

    const pagination = Pagination.create({ limit, page, rows })

    return right({
      messages,
      pagination,
    })
  }
}
