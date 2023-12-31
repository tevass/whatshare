import { faker } from '@faker-js/faker'
import { makeWAEntityID } from '@whatshare/server-core/factories'
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
      },
      makeWAEntityID(),
    )

    expect(waChat).toBeTruthy()
  })
})
