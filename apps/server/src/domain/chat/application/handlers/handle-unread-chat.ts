import { Either, left, right } from '@/core/either'
import { WAEntityID } from '@/core/entities/wa-entity-id'
import { ResourceNotFoundError } from '@/domain/shared/application/errors/resource-not-found-error'
import { Chat } from '../../enterprise/entities/chat'
import { ChatEmitter } from '../emitters/chat-emitter'
import { ChatsRepository } from '../repositories/chats-repository'
import { WAService } from '../services/wa-service'
import { WAClientNotFoundError } from './errors/wa-client-not-found-error'

interface HandleUnreadChatRequest {
  waChatId: string
  whatsAppId: string
}

type HandleUnreadChatResponse = Either<
  ResourceNotFoundError | WAClientNotFoundError,
  {
    chat: Chat
  }
>

export class HandleUnreadChat {
  constructor(
    private chatsRepository: ChatsRepository,
    private waService: WAService,
    private chatEmitter: ChatEmitter,
  ) {}

  async execute(
    request: HandleUnreadChatRequest,
  ): Promise<HandleUnreadChatResponse> {
    const { waChatId, whatsAppId } = request

    const chat = await this.chatsRepository.findByWAChatIdAndWhatsAppId({
      waChatId: WAEntityID.createFromString(waChatId),
      whatsAppId,
    })

    if (!chat) {
      return left(new ResourceNotFoundError(waChatId))
    }

    const waClient = this.waService.get(chat.whatsAppId.toString())
    if (!waClient) {
      return left(new WAClientNotFoundError(chat.whatsAppId.toString()))
    }

    await waClient.chat.markUnreadById(chat.waChatId)

    chat.unread()
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
