import { Module } from '@nestjs/common'

import { FetchChatsController } from './fetch-chats.controller'

import { FetchChatsUseCase } from '@/domain/chat/application/use-cases/chats/fetch-chats-use-case'

@Module({
  controllers: [FetchChatsController],
  providers: [FetchChatsUseCase],
})
export class ChatsModule {}
