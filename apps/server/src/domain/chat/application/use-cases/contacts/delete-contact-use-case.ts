import { Either, left, right } from '@/core/either'
import { Contact } from '@/domain/chat/enterprise/entities/contact'
import { ResourceNotFoundError } from '@/domain/shared/application/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { ContactsRepository } from '../../repositories/contacts-repository'

interface DeleteContactUseCaseRequest {
  contactId: string
}

type DeleteContactUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    contact: Contact
  }
>

@Injectable()
export class DeleteContactUseCase {
  constructor(private contactsRepository: ContactsRepository) {}

  async execute(
    request: DeleteContactUseCaseRequest,
  ): Promise<DeleteContactUseCaseResponse> {
    const { contactId } = request

    const contact = await this.contactsRepository.findById({ id: contactId })
    if (!contact) {
      return left(new ResourceNotFoundError(contactId))
    }

    contact.set({ isMyContact: false })
    await this.contactsRepository.save(contact)

    return right({ contact })
  }
}
