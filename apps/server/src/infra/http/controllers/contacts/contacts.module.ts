import { Module } from '@nestjs/common'

import { FetchContactsController } from './fetch-contacts.controller'

import { FetchContactsUseCase } from '@/domain/chat/application/use-cases/contacts/fetch-contacts-use-case'
import { CreateContactController } from './create-contact.controller'
import { CreateContactUseCase } from '@/domain/chat/application/use-cases/contacts/create-contact-use-case'
import { GetContactController } from './get-contact.controller'
import { GetContactUseCase } from '@/domain/chat/application/use-cases/contacts/get-contact-use-case'

@Module({
  controllers: [
    FetchContactsController,
    CreateContactController,
    GetContactController,
  ],
  providers: [FetchContactsUseCase, CreateContactUseCase, GetContactUseCase],
})
export class ContactsModule {}
