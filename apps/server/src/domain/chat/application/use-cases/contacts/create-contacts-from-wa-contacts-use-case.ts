import { Either, right } from '@/core/either'
import { Contact } from '@/domain/chat/enterprise/entities/contact'
import { ContactsRepository } from '../../repositories/contacts-repository'
import { WAContact } from '../../entities/wa-contact'
import { Injectable } from '@nestjs/common'
import { ContactPhone } from '@/domain/chat/enterprise/entities/value-objects/contact-phone'

interface CreateContactsFromWaContactsUseCaseRequest {
  waContacts: WAContact[]
}

type CreateContactsFromWaContactsUseCaseResponse = Either<
  null,
  {
    contacts: Contact[]
  }
>

@Injectable()
export class CreateContactsFromWaContactsUseCase {
  constructor(private contactsRepository: ContactsRepository) {}

  async execute(
    request: CreateContactsFromWaContactsUseCaseRequest,
  ): Promise<CreateContactsFromWaContactsUseCaseResponse> {
    const { waContacts } = request

    const [waContactsThatAreMine, waMyContactsThatAreNotMineYet] = [
      waContacts.filter((waContact) => waContact.isMyContact),
      waContacts.filter((waContact) => !waContact.isMyContact),
    ]

    const waContactsThatAreMineIds = waContactsThatAreMine.map(
      (waContact) => waContact.id,
    )

    const myContacts = await this.contactsRepository.findManyByWAContactsIds({
      waContactsIds: waContactsThatAreMineIds,
    })

    myContacts.forEach((contact) => {
      const waContact = waContactsThatAreMine.find((waContact) =>
        waContact.id.equals(contact.waContactId),
      )

      if (!waContact) return

      contact.set({
        imageUrl: waContact.imageUrl,
        phone: ContactPhone.create({
          number: waContact.number,
          formattedNumber: waContact.formattedNumber,
        }),
      })
    })

    const contactsAreMineButNotExists = waContactsThatAreMine.filter(
      (waContact) => {
        return !myContacts.find((contact) =>
          contact.waContactId.equals(waContact.id),
        )
      },
    )

    const contactsToCreate = waMyContactsThatAreNotMineYet
      .concat(contactsAreMineButNotExists)
      .map((waContact) => waContact.toContact())

    await Promise.all([
      this.contactsRepository.createMany(contactsToCreate),
      this.contactsRepository.saveMany(myContacts),
    ])

    const contacts = myContacts.concat(contactsToCreate)

    return right({ contacts })
  }
}
