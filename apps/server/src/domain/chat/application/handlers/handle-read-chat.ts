import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/domain/shared/application/errors/resource-not-found-error'
import { Chat } from '../../enterprise/entities/chat'
import { ChatEmitter } from '../emitters/chat-emitter'
import { ChatsRepository } from '../repositories/chats-repository'
import { WAService } from '../services/wa-service'
import { UnexpectedWAClientResponseError } from './errors/unexpected-wa-client-response-error'
import { WAClientNotFoundError } from './errors/wa-client-not-found-error'

interface HandleReadChatRequest {
  chatId: string
}

type HandleReadChatResponse = Either<
  | ResourceNotFoundError
  | WAClientNotFoundError
  | UnexpectedWAClientResponseError,
  {
    chat: Chat
  }
>

export class HandleReadChat {
  constructor(
    private chatsRepository: ChatsRepository,
    private waService: WAService,
    private chatEmitter: ChatEmitter,
  ) {}

  async execute(
    request: HandleReadChatRequest,
  ): Promise<HandleReadChatResponse> {
    const { chatId } = request

    const chat = await this.chatsRepository.findById(chatId)

    if (!chat) {
      return left(new ResourceNotFoundError(chatId))
    }

    const waClient = this.waService.get(chat.whatsAppId.toString())
    if (!waClient) {
      return left(new WAClientNotFoundError(chat.whatsAppId.toString()))
    }

    const readWAChat = await waClient.chat.sendSeenById(chat.waChatId)
    if (!readWAChat) {
      return left(new UnexpectedWAClientResponseError(waClient.id.toString()))
    }

    chat.read()
    await this.chatsRepository.save(chat)

    this.chatEmitter.emit({
      event: 'chat:change',
      data: {
        chat,
      },
    })

    return right({
      chat,
    })
  }
}
