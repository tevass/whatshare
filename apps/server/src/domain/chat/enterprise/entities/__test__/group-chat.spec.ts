import { makeGroupMessage } from '@/test/factories/make-group-message'
import { makeUniqueEntityID } from '@/test/factories/make-unique-entity-id'
import { makeWAEntityID } from '@/test/factories/make-wa-entity-id'
import { faker } from '@faker-js/faker'
import { GroupChat } from '../group-chat'
import { makeGroup } from '@/test/factories/make-group'

describe('GroupChat', () => {
  test('create', () => {
    const chat = GroupChat.create({
      unreadCount: faker.number.int({ max: 99 }),
      whatsAppId: makeUniqueEntityID(),
      waChatId: makeWAEntityID(),
      group: makeGroup(),
    })

    expect(chat).toBeTruthy()
  })

  test('read', () => {
    const chat = GroupChat.create({
      unreadCount: faker.number.int({ max: 99 }),
      whatsAppId: makeUniqueEntityID(),
      waChatId: makeWAEntityID(),
      group: makeGroup(),
    })

    chat.read()
    expect(chat.unreadCount).toBe(0)
  })

  test('unread', () => {
    const chat = GroupChat.create({
      unreadCount: faker.number.int({ max: 99 }),
      whatsAppId: makeUniqueEntityID(),
      waChatId: makeWAEntityID(),
      group: makeGroup(),
    })

    chat.unread()
    expect(chat.unreadCount).toBe(-1)
  })

  test('clear', () => {
    const chat = GroupChat.create({
      unreadCount: faker.number.int({ max: 99 }),
      whatsAppId: makeUniqueEntityID(),
      waChatId: makeWAEntityID(),
      group: makeGroup(),
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
    const chat = GroupChat.create({
      unreadCount: faker.number.int({ max: 99 }),
      whatsAppId: makeUniqueEntityID(),
      waChatId: makeWAEntityID(),
      group: makeGroup(),
    })

    const message = makeGroupMessage()
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
