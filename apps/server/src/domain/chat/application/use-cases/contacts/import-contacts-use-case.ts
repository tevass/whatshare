import { Either, left, right } from '@/core/either'
import { Contact } from '@/domain/chat/enterprise/entities/contact'
import { ResourceNotFoundError } from '@/domain/shared/application/errors/resource-not-found-error'
import { WAClientNotFoundError } from '../../handlers/errors/wa-client-not-found-error'
import { ContactsRepository } from '../../repositories/contacts-repository'
import { WhatsAppsRepository } from '../../repositories/whats-apps-repository'
import { WAClientManager } from '../../services/wa-client-manager'

interface ImportContactsUseCaseRequest {
  whatsAppId: string
}

type ImportContactsUseCaseResponse = Either<
  ResourceNotFoundError | WAClientNotFoundError,
  {
    contacts: Contact[]
  }
>

export class ImportContactsUseCase {
  constructor(
    private whatsAppsRepository: WhatsAppsRepository,
    private contactsRepository: ContactsRepository,
    private waManager: WAClientManager,
  ) {}

  async execute(
    request: ImportContactsUseCaseRequest,
  ): Promise<ImportContactsUseCaseResponse> {
    const { whatsAppId } = request

    const whatsApp = await this.whatsAppsRepository.findById({ id: whatsAppId })
    if (!whatsApp) {
      return left(new ResourceNotFoundError(whatsAppId))
    }

    const waClient = this.waManager.getConnectedClientById(whatsApp.id)
    if (!waClient) {
      return left(new WAClientNotFoundError(whatsAppId))
    }

    const allWaContacts = await waClient.contact.getMany()
    const waContacts = allWaContacts.filter((waContact) => !waContact.isGroup)
    const waContactsIds = waContacts.map((waContact) => waContact.id)

    const contactsAlreadyExists =
      await this.contactsRepository.findManyByWAContactsIds({
        waContactsIds,
      })

    const waContactsToCreate = waContacts.filter(
      (waContact) =>
        !contactsAlreadyExists.some((contact) =>
          contact.waContactId.equals(waContact.id),
        ),
    )

    const contacts = waContactsToCreate.map((waContact) =>
      waContact.toContact(),
    )

    await this.contactsRepository.createMany(contacts)

    return right({
      contacts,
    })
  }
}
