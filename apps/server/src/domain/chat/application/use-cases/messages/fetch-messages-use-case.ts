import { Either, right } from '@/core/either'
import { Message } from '@/domain/chat/enterprise/entities/message'
import { Pagination } from '@/domain/chat/enterprise/utilities/pagination'
import { PaginationRequest } from '@/domain/shared/application/use-cases/pagination-request'
import { MessagesRepository } from '../../repositories/messages-repository'

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

export class FetchMessagesUseCase {
  constructor(private messagesRepository: MessagesRepository) {}

  async execute(
    request: FetchMessagesUseCaseRequest,
  ): Promise<FetchMessagesUseCaseResponse> {
    const { chatId, page } = request

    const limit = Pagination.limit(100)

    const [rows, messages] = await Promise.all([
      this.messagesRepository.countManyByChatId({ chatId }),
      this.messagesRepository.findManyByChatId({
        take: limit,
        chatId,
        page,
      }),
    ])

    const pagination = Pagination.create({ limit, page, rows })

    return right({
      messages,
      pagination,
    })
  }
}
