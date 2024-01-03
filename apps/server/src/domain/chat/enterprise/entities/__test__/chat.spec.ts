import { makeContact } from '@/test/factories/make-contact'
import { makeMessage } from '@/test/factories/make-message'
import { makeUniqueEntityID } from '@/test/factories/make-unique-entity-id'
import { makeWAEntityID } from '@/test/factories/make-wa-entity-id'
import { faker } from '@faker-js/faker'
import { Chat } from '../chat'

describe('Chat', () => {
  test('create', () => {
    const chat = Chat.create({
      contact: makeContact(),
      unreadCount: faker.number.int({ max: 99 }),
      whatsAppId: makeUniqueEntityID(),
      waChatId: makeWAEntityID(),
    })

    expect(chat).toBeTruthy()
  })

  test('read', () => {
    const chat = Chat.create({
      contact: makeContact(),
      unreadCount: faker.number.int({ max: 99 }),
      whatsAppId: makeUniqueEntityID(),
      waChatId: makeWAEntityID(),
    })

    chat.read()
    expect(chat.unreadCount).toBe(0)
  })

  test('unread', () => {
    const chat = Chat.create({
      contact: makeContact(),
      unreadCount: faker.number.int({ max: 99 }),
      whatsAppId: makeUniqueEntityID(),
      waChatId: makeWAEntityID(),
    })

    chat.unread()
    expect(chat.unreadCount).toBe(-1)
  })

  test('clear', () => {
    const chat = Chat.create({
      contact: makeContact(),
      unreadCount: faker.number.int({ max: 99 }),
      whatsAppId: makeUniqueEntityID(),
      waChatId: makeWAEntityID(),
    })

    chat.clear()
    expect(chat).toEqual(
      expect.objectContaining({
        unreadCount: 0,
        lastMessage: null,
        deletedAt: expect.any(Date),
      }),
    )
  })

  test('interact', () => {
    const chat = Chat.create({
      contact: makeContact(),
      unreadCount: faker.number.int({ max: 99 }),
      whatsAppId: makeUniqueEntityID(),
      waChatId: makeWAEntityID(),
    })

    const message = makeMessage()
    chat.interact(message)

    expect(chat).toEqual(
      expect.objectContaining({
        lastMessage: message,
        lastInteraction: message.createdAt,
        deletedAt: null,
      }),
    )
  })
})
