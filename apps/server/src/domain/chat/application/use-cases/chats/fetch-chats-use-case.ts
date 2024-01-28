import { Either, right } from '@/core/either'
import { Chat } from '@/domain/chat/enterprise/entities/chat'
import { PaginationRequest } from '@/domain/shared/application/use-cases/pagination-request'
import { Pagination } from '@/domain/shared/enterprise/utilities/pagination'
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

    const filters = {
      deleted: false,
    }

    const [rows, chats] = await Promise.all([
      this.chatsRepository.countManyByWhatsAppId({
        whatsAppId,
        ...filters,
      }),
      this.chatsRepository.findManyByWhatsAppId({
        page,
        take: limit,
        whatsAppId,
        ...filters,
      }),
    ])

    const pagination = Pagination.create({ limit, page, rows })

    return right({
      chats,
      pagination,
    })
  }
}
