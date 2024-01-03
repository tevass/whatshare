import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/domain/shared/application/errors/resource-not-found-error'
import { Chat } from '../../enterprise/entities/chat'
import { ChatEmitter } from '../emitters/chat-emitter'
import { ChatsRepository } from '../repositories/chats-repository'
import { MessagesRepository } from '../repositories/messages-repository'
import { WAService } from '../services/wa-service'
import { WAClientNotFoundError } from './errors/wa-client-not-found-error'

interface HandleClearChatRequest {
  chatId: string
}

type HandleClearChatResponse = Either<
  ResourceNotFoundError | WAClientNotFoundError,
  {
    chat: Chat
  }
>

export class HandleClearChat {
  constructor(
    private chatsRepository: ChatsRepository,
    private messagesRepository: MessagesRepository,
    private waService: WAService,
    private chatEmitter: ChatEmitter,
  ) {}

  async execute(
    request: HandleClearChatRequest,
  ): Promise<HandleClearChatResponse> {
    const { chatId } = request

    const chat = await this.chatsRepository.findById(chatId)

    if (!chat) {
      return left(new ResourceNotFoundError(chatId))
    }

    const waClient = this.waService.get(chat.whatsAppId.toString())
    if (!waClient) {
      return left(new WAClientNotFoundError(chat.whatsAppId.toString()))
    }

    await waClient.chat.clearById(chat.waChatId)
    chat.clear()

    const [messages] = await Promise.all([
      this.messagesRepository.findManyByChatId(chat.id.toString()),
      this.chatsRepository.save(chat),
    ])

    messages.forEach((message) => message.delete())
    await this.messagesRepository.saveMany(messages)

    this.chatEmitter.emit({
      event: 'chat:clear',
      data: {
        chat,
      },
    })

    return right({
      chat,
    })
  }
}
