import { makeContact } from '@/test/factories/make-contact'
import { makeWAChat } from '@/test/factories/make-wa-chat'
import { makeWAContact } from '@/test/factories/make-wa-contact'
import { InMemoryChatsRepository } from '@/test/repositories/in-memory-chats-repository'
import { InMemoryContactsRepository } from '@/test/repositories/in-memory-contacts-repository'
import { CreateContactsFromWaContactsUseCase } from '../../contacts/create-contacts-from-wa-contacts-use-case'
import { CreateChatFromWaChatUseCase } from '../create-chat-from-wa-chat-use-case'

let inMemoryContactsRepository: InMemoryContactsRepository
let inMemoryChatsRepository: InMemoryChatsRepository
let createContactsFromWaContactsUseCase: CreateContactsFromWaContactsUseCase

let sut: CreateChatFromWaChatUseCase

describe('CreateChatFromUseCase', () => {
  beforeEach(() => {
    inMemoryContactsRepository = new InMemoryContactsRepository()
    inMemoryChatsRepository = new InMemoryChatsRepository()
    createContactsFromWaContactsUseCase =
      new CreateContactsFromWaContactsUseCase(inMemoryContactsRepository)

    sut = new CreateChatFromWaChatUseCase(
      inMemoryContactsRepository,
      inMemoryChatsRepository,
      createContactsFromWaContactsUseCase,
    )
  })

  it('should be able to create chat from wa-chat', async () => {
    const waContact = makeWAContact()
    const waChat = makeWAChat({
      isGroup: false,
      participants: null,
      contact: waContact,
    })

    const contact = makeContact({ waContactId: waContact.id, isGroup: false })
    inMemoryContactsRepository.items.push(contact)

    const response = await sut.execute({
      waChat,
    })

    expect(response.isRight()).toBe(true)
    if (response.isLeft()) return

    expect(inMemoryChatsRepository.items).toHaveLength(1)
  })

  it('should be able to create contacts from wa-group-chat', async () => {
    const waContact = makeWAContact()
    const waChat = makeWAChat({
      isGroup: true,
      contact: waContact,
      participants: Array.from(Array(2)).map(() =>
        makeWAContact({ isGroup: false }),
      ),
    })

    const contact = makeContact({ waContactId: waContact.id, isGroup: false })
    inMemoryContactsRepository.items.push(contact)

    const response = await sut.execute({
      waChat,
    })

    expect(response.isRight()).toBe(true)
    if (response.isLeft()) return

    expect(inMemoryContactsRepository.items).toHaveLength(3)
  })
})
