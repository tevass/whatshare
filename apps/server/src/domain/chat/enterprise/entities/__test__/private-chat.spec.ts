import { makeContact } from '@/test/factories/make-contact'
import { makeUniqueEntityID } from '@/test/factories/make-unique-entity-id'
import { makeWAEntityID } from '@/test/factories/make-wa-entity-id'
import { faker } from '@faker-js/faker'
import { PrivateChat } from '../private-chat'
import { makePrivateMessage } from '@/test/factories/make-private-message'

describe('PrivateChat', () => {
  test('create', () => {
    const chat = PrivateChat.create({
      contact: makeContact(),
      unreadCount: faker.number.int({ max: 99 }),
      whatsAppId: makeUniqueEntityID(),
      waChatId: makeWAEntityID(),
    })

    expect(chat).toBeTruthy()
  })

  test('read', () => {
    const chat = PrivateChat.create({
      contact: makeContact(),
      unreadCount: faker.number.int({ max: 99 }),
      whatsAppId: makeUniqueEntityID(),
      waChatId: makeWAEntityID(),
    })

    chat.read()
    expect(chat.unreadCount).toBe(0)
  })

  test('unread', () => {
    const chat = PrivateChat.create({
      contact: makeContact(),
      unreadCount: faker.number.int({ max: 99 }),
      whatsAppId: makeUniqueEntityID(),
      waChatId: makeWAEntityID(),
    })

    chat.unread()
    expect(chat.unreadCount).toBe(-1)
  })

  test('clear', () => {
    const chat = PrivateChat.create({
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
    const chat = PrivateChat.create({
      contact: makeContact(),
      unreadCount: faker.number.int({ max: 99 }),
      whatsAppId: makeUniqueEntityID(),
      waChatId: makeWAEntityID(),
    })

    const message = makePrivateMessage()
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
