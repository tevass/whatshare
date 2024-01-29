import { Either, left, right } from '@/core/either'
import { Contact } from '@/domain/chat/enterprise/entities/contact'
import { ContactsRepository } from '../../repositories/contacts-repository'
import { ResourceNotFoundError } from '@/domain/shared/application/errors/resource-not-found-error'
import { ContactAlreadyExistsError } from '../errors/contact-already-exists-error'
import { ContactPhone } from '@/domain/chat/enterprise/entities/value-objects/contact-phone'
import { WAClientManager } from '../../services/wa-client-manager'
import { WAEntityID } from '@/core/entities/wa-entity-id'

interface UpdateContactUseCaseRequest {
  contactId: string
  name: string
  number: string
}

type UpdateContactUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    contact: Contact
  }
>

export class UpdateContactUseCase {
  constructor(
    private contactsRepository: ContactsRepository,
    private waManager: WAClientManager,
  ) {}

  async execute(
    request: UpdateContactUseCaseRequest,
  ): Promise<UpdateContactUseCaseResponse> {
    const { contactId, name, number } = request

    const contact = await this.contactsRepository.findById({ id: contactId })
    if (!contact) {
      return left(new ResourceNotFoundError(contactId))
    }

    const contactWithSamePhone = await this.contactsRepository.findByPhone({
      phone: number,
    })

    if (contactWithSamePhone && !contact.equals(contactWithSamePhone)) {
      return left(new ContactAlreadyExistsError(number))
    }

    let waContactId = new WAEntityID({ ref: number })
    let phone = ContactPhone.create({
      number,
    })

    const waClient = this.waManager.getSomeConnectedClient()
    if (waClient) {
      const waContact = await waClient.contact.getById(
        new WAEntityID({ ref: number }),
      )

      waContactId = waContact.id
      phone = ContactPhone.create({
        number: waContact.number,
        formattedNumber: waContact.formattedNumber,
      })

      contact.set({ imageUrl: waContact.imageUrl })
    }

    contact.set({ phone, name, waContactId })
    await this.contactsRepository.save(contact)

    return right({ contact })
  }
}
