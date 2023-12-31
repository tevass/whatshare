import { makeContact } from '@/test/factories/make-contact'
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
})
