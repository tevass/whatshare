import { Either, left, right } from '@/core/either'
import { WAEntityID } from '@/core/entities/wa-entity-id'
import { ResourceNotFoundError } from '@/domain/shared/application/errors/resource-not-found-error'
import { Chat } from '../../enterprise/entities/chat'
import { ChatEmitter } from '../emitters/chat-emitter'
import { ChatsRepository } from '../repositories/chats-repository'
import { MessagesRepository } from '../repositories/messages-repository'
import { WAServiceNotFoundError } from './errors/wa-service-not-found-error'
import { WAServiceManager } from '../services/wa-service-manager'

interface HandleClearChatRequest {
  waChatId: string
  whatsAppId: string
}

type HandleClearChatResponse = Either<
  ResourceNotFoundError | WAServiceNotFoundError,
  {
    chat: Chat
  }
>

export class HandleClearChat {
  constructor(
    private chatsRepository: ChatsRepository,
    private messagesRepository: MessagesRepository,
    private waManager: WAServiceManager,
    private chatEmitter: ChatEmitter,
  ) {}

  async execute(
    request: HandleClearChatRequest,
  ): Promise<HandleClearChatResponse> {
    const { waChatId, whatsAppId } = request

    const chat = await this.chatsRepository.findByWAChatIdAndWhatsAppId({
      waChatId: WAEntityID.createFromString(waChatId),
      whatsAppId,
    })

    if (!chat) {
      return left(new ResourceNotFoundError(`${waChatId}-${whatsAppId}`))
    }

    const waClient = this.waManager.get(chat.whatsAppId)
    if (!waClient) {
      return left(new WAServiceNotFoundError(chat.whatsAppId.toString()))
    }

    await waClient.chat.clearById(chat.waChatId)
    chat.clear()

    const [messages] = await Promise.all([
      this.messagesRepository.findAllByChatId({
        chatId: chat.id.toString(),
      }),
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
