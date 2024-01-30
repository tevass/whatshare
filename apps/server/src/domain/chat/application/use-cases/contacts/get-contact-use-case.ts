import { Either, left, right } from '@/core/either'
import { Contact } from '@/domain/chat/enterprise/entities/contact'
import { ContactsRepository } from '../../repositories/contacts-repository'
import { ResourceNotFoundError } from '@/domain/shared/application/errors/resource-not-found-error'

interface GetContactUseCaseRequest {
  contactId: string
}

type GetContactUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    contact: Contact
  }
>

export class GetContactUseCase {
  constructor(private contactsRepository: ContactsRepository) {}

  async execute(
    request: GetContactUseCaseRequest,
  ): Promise<GetContactUseCaseResponse> {
    const { contactId } = request

    const contact = await this.contactsRepository.findById({ id: contactId })
    if (!contact) {
      return left(new ResourceNotFoundError(contactId))
    }

    return right({ contact })
  }
}
