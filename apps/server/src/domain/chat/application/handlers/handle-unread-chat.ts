import { Either, left, right } from '@/core/either'
import { WAEntityID } from '@/core/entities/wa-entity-id'
import { ResourceNotFoundError } from '@/domain/shared/application/errors/resource-not-found-error'
import { Chat } from '../../enterprise/entities/chat'
import { ChatEmitter } from '../emitters/chat-emitter'
import { ChatsRepository } from '../repositories/chats-repository'
import { WAServiceManager } from '../services/wa-service-manager'
import { WAServiceNotFoundError } from './errors/wa-service-not-found-error'

interface HandleUnreadChatRequest {
  waChatId: string
  whatsAppId: string
}

type HandleUnreadChatResponse = Either<
  ResourceNotFoundError | WAServiceNotFoundError,
  {
    chat: Chat
  }
>

export class HandleUnreadChat {
  constructor(
    private chatsRepository: ChatsRepository,
    private waManager: WAServiceManager,
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

    const waClient = this.waManager.get(chat.whatsAppId)
    if (!waClient) {
      return left(new WAServiceNotFoundError(chat.whatsAppId.toString()))
    }

    await waClient.chat.markUnreadById(chat.waChatId)

    chat.unread()
    await this.chatsRepository.save(chat)

    this.chatEmitter.emitChange({
      chat,
    })

    return right({
      chat,
    })
  }
}
