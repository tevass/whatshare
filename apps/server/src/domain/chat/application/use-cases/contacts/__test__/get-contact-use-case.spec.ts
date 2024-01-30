import { InMemoryContactsRepository } from '@/test/repositories/in-memory-contacts-repository'
import { GetContactUseCase } from '../get-contact-use-case'
import { makeContact } from '@/test/factories/make-contact'

let inMemoryContactsRepository: InMemoryContactsRepository

let sut: GetContactUseCase

describe('GetContactUseCase', () => {
  beforeEach(() => {
    inMemoryContactsRepository = new InMemoryContactsRepository()

    sut = new GetContactUseCase(inMemoryContactsRepository)
  })

  it('should be able to get a contact', async () => {
    const contact = makeContact()
    inMemoryContactsRepository.items.push(contact)

    const response = await sut.execute({
      contactId: contact.id.toString(),
    })

    expect(response.isRight()).toBe(true)
  })
})
