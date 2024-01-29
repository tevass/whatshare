import { InMemoryContactsRepository } from '@/test/repositories/in-memory-contacts-repository'
import { DeleteContactUseCase } from '../delete-contact-use-case'
import { makeContact } from '@/test/factories/make-contact'

let inMemoryContactsRepository: InMemoryContactsRepository

let sut: DeleteContactUseCase

describe('DeleteContactUseCase', () => {
  beforeEach(() => {
    inMemoryContactsRepository = new InMemoryContactsRepository()

    sut = new DeleteContactUseCase(inMemoryContactsRepository)
  })

  it('should be able to delete a contact', async () => {
    const contact = makeContact()
    inMemoryContactsRepository.items.push(contact)

    const response = await sut.execute({
      contactId: contact.id.toString(),
    })

    expect(response.isRight()).toBe(true)
    if (response.isLeft()) return

    expect(response.value.contact).toEqual(
      expect.objectContaining({
        isMyContact: false,
        isUnknown: true,
      }),
    )
  })
})
