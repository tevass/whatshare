import { Either, right } from '@/core/either'
import { Chat } from '@/domain/chat/enterprise/entities/chat'
import { Pagination } from '@/domain/chat/enterprise/utilities/pagination'
import { PaginationRequest } from '@/domain/shared/application/use-cases/pagination-request'
import { ChatsRepository } from '../../repositories/chats-repository'

interface FetchChatsUseCaseRequest extends PaginationRequest {
  whatsAppId: string
}

type FetchChatsUseCaseResponse = Either<
  null,
  {
    chats: Chat[]
    pagination: Pagination
  }
>

export class FetchChatsUseCase {
  constructor(private chatsRepository: ChatsRepository) {}

  async execute(
    request: FetchChatsUseCaseRequest,
  ): Promise<FetchChatsUseCaseResponse> {
    const { whatsAppId, page } = request

    const limit = Pagination.limit(100)

    const [rows, chats] = await Promise.all([
      this.chatsRepository.countManyByWhatsAppId({
        whatsAppId,
      }),
      this.chatsRepository.findManyByWhatsAppId({
        page,
        take: limit,
        whatsAppId,
      }),
    ])

    const pagination = Pagination.create({ limit, page, rows })

    return right({
      chats,
      pagination,
    })
  }
}
