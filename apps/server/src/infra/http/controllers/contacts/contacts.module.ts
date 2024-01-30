import { Module } from '@nestjs/common'

import { FetchContactsController } from './fetch-contacts.controller'

import { FetchContactsUseCase } from '@/domain/chat/application/use-cases/contacts/fetch-contacts-use-case'
import { CreateContactController } from './create-contact.controller'
import { CreateContactUseCase } from '@/domain/chat/application/use-cases/contacts/create-contact-use-case'
import { GetContactController } from './get-contact.controller'
import { GetContactUseCase } from '@/domain/chat/application/use-cases/contacts/get-contact-use-case'
import { UpdateContactController } from './update-contact.controller'
import { UpdateContactUseCase } from '@/domain/chat/application/use-cases/contacts/update-contact-use-case'
import { DeleteContactController } from './delete-contact.controller'
import { DeleteContactUseCase } from '@/domain/chat/application/use-cases/contacts/delete-contact-use-case'

@Module({
  controllers: [
    FetchContactsController,
    CreateContactController,
    GetContactController,
    UpdateContactController,
    DeleteContactController,
  ],
  providers: [
    FetchContactsUseCase,
    CreateContactUseCase,
    GetContactUseCase,
    UpdateContactUseCase,
    DeleteContactUseCase,
  ],
})
export class ContactsModule {}
