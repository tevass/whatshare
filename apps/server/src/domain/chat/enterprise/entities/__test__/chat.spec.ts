import { makeContact } from '@/test/factories/make-contact'
import { faker } from '@faker-js/faker'
import {
  makeUniqueEntityID,
  makeWAEntityID,
} from '@whatshare/server-core/factories'
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
