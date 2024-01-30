import { Module } from '@nestjs/common'

import { FetchContactsController } from './fetch-contacts.controller'

import { FetchContactsUseCase } from '@/domain/chat/application/use-cases/contacts/fetch-contacts-use-case'
import { CreateContactController } from './create-contact.controller'
import { CreateContactUseCase } from '@/domain/chat/application/use-cases/contacts/create-contact-use-case'

@Module({
  controllers: [FetchContactsController, CreateContactController],
  providers: [FetchContactsUseCase, CreateContactUseCase],
})
export class ContactsModule {}
