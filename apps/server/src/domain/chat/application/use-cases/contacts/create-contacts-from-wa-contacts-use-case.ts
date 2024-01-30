import { Either, right } from '@/core/either'
import { Contact } from '@/domain/chat/enterprise/entities/contact'
import { ContactsRepository } from '../../repositories/contacts-repository'
import { WAContact } from '../../entities/wa-contact'
import { Injectable } from '@nestjs/common'

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

    const contactsAteMineButNotExists = waContactsThatAreMine.filter(
      (waContact) => {
        return !myContacts.find((contact) =>
          contact.waContactId.equals(waContact.id),
        )
      },
    )

    const contactsToCreate = waMyContactsThatAreNotMineYet
      .concat(contactsAteMineButNotExists)
      .map((waContact) => waContact.toContact())

    await this.contactsRepository.createMany(contactsToCreate)

    const contacts = myContacts.concat(contactsToCreate)

    return right({ contacts })
  }
}
