import { Either, right } from '@/core/either'
import { Chat } from '@/domain/chat/enterprise/entities/chat'
import { ChatsRepository } from '../../repositories/chats-repository'

interface FetchChatsUseCaseRequest {
  whatsAppId: string
}

type FetchChatsUseCaseResponse = Either<
  null,
  {
    chats: Chat[]
  }
>

export class FetchChatsUseCase {
  constructor(private chatsRepository: ChatsRepository) {}

  async execute(
    request: FetchChatsUseCaseRequest,
  ): Promise<FetchChatsUseCaseResponse> {
    const { whatsAppId } = request

    const chats = await this.chatsRepository.findManyByWhatsAppId(whatsAppId)

    return right({
      chats,
    })
  }
}
