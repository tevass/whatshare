import { Either, left, right } from '@/core/either'
import { Contact } from '@/domain/chat/enterprise/entities/contact'
import { ResourceNotFoundError } from '@/domain/shared/application/errors/resource-not-found-error'
import { WAServiceNotFoundError } from '../../handlers/errors/wa-service-not-found-error'
import { ContactsRepository } from '../../repositories/contacts-repository'
import { WhatsAppsRepository } from '../../repositories/whats-apps-repository'
import { WAServiceManager } from '../../services/wa-service-manager'

interface ImportContactsUseCaseRequest {
  whatsAppId: string
}

type ImportContactsUseCaseResponse = Either<
  ResourceNotFoundError | WAServiceNotFoundError,
  {
    contacts: Contact[]
  }
>

export class ImportContactsUseCase {
  constructor(
    private whatsAppRepository: WhatsAppsRepository,
    private contactsRepository: ContactsRepository,
    private waManager: WAServiceManager,
  ) {}

  async execute(
    request: ImportContactsUseCaseRequest,
  ): Promise<ImportContactsUseCaseResponse> {
    const { whatsAppId } = request

    const whatsApp = await this.whatsAppRepository.findById(whatsAppId)
    if (!whatsApp) {
      return left(new ResourceNotFoundError(whatsAppId))
    }

    const waClient = this.waManager.get(whatsApp.id)
    if (!waClient) {
      return left(new WAServiceNotFoundError(whatsAppId))
    }

    const waContacts = await waClient.contact.getMany()
    const waContactsIds = waContacts.map((waContact) => waContact.id)

    const contactsAlreadyExists =
      await this.contactsRepository.findManyByWAContactsIds({
        waContactsIds,
        includeUnknowns: true,
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