import { Either, left, right } from '@/core/either'
import { Chat } from '@/domain/chat/enterprise/entities/chat'
import { ResourceNotFoundError } from '@/domain/shared/application/errors/resource-not-found-error'
import { ChatEmitter } from '../emitters/chat-emitter'
import { WAChat } from '../entities/wa-chat'
import { ChatsRepository } from '../repositories/chats-repository'

interface HandleWAChangeUnreadCountRequest {
  waChat: WAChat
  whatsAppId: string
}

type HandleWAChangeUnreadCountResponse = Either<
  ResourceNotFoundError,
  {
    chat: Chat
  }
>

export class HandleWAChangeUnreadCount {
  constructor(
    private chatsRepository: ChatsRepository,
    private chatEmitter: ChatEmitter,
  ) {}

  async execute(
    request: HandleWAChangeUnreadCountRequest,
  ): Promise<HandleWAChangeUnreadCountResponse> {
    const { waChat, whatsAppId } = request

    const chat = await this.chatsRepository.findByWAChatIdAndWhatsAppId({
      whatsAppId,
      waChatId: waChat.id,
    })

    if (!chat) {
      return left(new ResourceNotFoundError(waChat.id.toString()))
    }

    chat.set({ unreadCount: waChat.unreadCount })
    await this.chatsRepository.save(chat)

    this.chatEmitter.emit({
      event: 'chat:change',
      data: {
        chat,
      },
    })

    return right({ chat })
  }
}
