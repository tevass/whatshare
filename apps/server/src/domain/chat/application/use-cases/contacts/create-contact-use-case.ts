import { Either, left, right } from '@/core/either'
import { WAEntityID } from '@/core/entities/wa-entity-id'
import { Contact } from '@/domain/chat/enterprise/entities/contact'
import { ContactPhone } from '@/domain/chat/enterprise/entities/value-objects/contact-phone'
import { ContactsRepository } from '../../repositories/contacts-repository'
import { WAClientManager } from '../../services/wa-client-manager'
import { ContactAlreadyExistsError } from '../errors/contact-already-exists-error'

interface CreateContactUseCaseRequest {
  name: string
  number: string
}

type CreateContactUseCaseResponse = Either<
  ContactAlreadyExistsError,
  {
    contact: Contact
  }
>

export class CreateContactUseCase {
  constructor(
    private contactsRepository: ContactsRepository,
    private waManager: WAClientManager,
  ) {}

  async execute(
    request: CreateContactUseCaseRequest,
  ): Promise<CreateContactUseCaseResponse> {
    const { name, number } = request

    const contactWithSamePhone = await this.contactsRepository.findByPhone({
      phone: number,
    })

    if (contactWithSamePhone && contactWithSamePhone.isMyContact) {
      return left(new ContactAlreadyExistsError(number))
    }

    if (contactWithSamePhone && contactWithSamePhone.isUnknown) {
      const contact = contactWithSamePhone
      contact.set({ name, isMyContact: true })

      await this.contactsRepository.save(contact)

      return right({ contact })
    }

    let contact: Contact

    const waContactId = new WAEntityID({ ref: number })
    const waClient = this.waManager.getSomeConnectedClient()

    if (waClient) {
      const waContact = await waClient.contact.getById(waContactId)

      contact = waContact.toContact()
    } else {
      const phone = ContactPhone.create({
        number,
      })

      contact = Contact.create({
        name,
        phone,
        waContactId,
      })
    }

    await this.contactsRepository.create(contact)

    return right({ contact })
  }
}
