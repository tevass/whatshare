import { Module } from '@nestjs/common'

import { FetchContactsController } from './fetch-contacts.controller'

import { FetchContactsUseCase } from '@/domain/chat/application/use-cases/contacts/fetch-contacts-use-case'

@Module({
  controllers: [FetchContactsController],
  providers: [FetchContactsUseCase],
})
export class ContactsModule {}
