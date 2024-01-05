import { Chat } from '@/domain/chat/enterprise/entities/chat'
import { makeUniqueEntityID } from '@/test/factories/make-unique-entity-id'
import { makeWAContact } from '@/test/factories/make-wa-contact'
import { makeWAEntityID } from '@/test/factories/make-wa-entity-id'
import { faker } from '@faker-js/faker'
import dayjs from 'dayjs'
import { WAChat } from '../wa-chat'

describe('WAChat', () => {
  test('create', () => {
    const waChat = WAChat.create(
      {
        isGroup: faker.datatype.boolean(),
        name: faker.person.firstName(),
        timestamp: dayjs().unix(),
        unreadCount: faker.number.int({ max: 99 }),
        imageUrl: faker.internet.url(),
        contact: makeWAContact(),
        waClientId: makeUniqueEntityID(),
      },
      makeWAEntityID(),
    )

    expect(waChat).toBeTruthy()
  })

  test('toChat', () => {
    const waChat = WAChat.create(
      {
        isGroup: faker.datatype.boolean(),
        name: faker.person.firstName(),
        timestamp: dayjs().unix(),
        unreadCount: faker.number.int({ max: 99 }),
        imageUrl: faker.internet.url(),
        contact: makeWAContact(),
        waClientId: makeUniqueEntityID(),
      },
      makeWAEntityID(),
    )

    expect(waChat.toChat()).toBeInstanceOf(Chat)
  })
})
