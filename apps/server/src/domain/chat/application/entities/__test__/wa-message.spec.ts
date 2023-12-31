import { makeWAContact } from '@/test/factories/make-wa-contact'
import { makeWAEntityID } from '@/test/factories/make-wa-entity-id'
import { makeWAMessageID } from '@/test/factories/make-wa-message-id'
import { makeWAMessageMedia } from '@/test/factories/value-objects/make-wa-message-media'
import { faker } from '@faker-js/faker'
import dayjs from 'dayjs'
import { WAMessage } from '../wa-message'

describe('WA', () => {
  test('create', () => {
    const waMessage = WAMessage.create(
      {
        ack: 'pending',
        author: makeWAEntityID(),
        body: faker.lorem.paragraph(),
        chatId: makeWAEntityID(),
        isBroadcast: faker.datatype.boolean(),
        isForwarded: faker.datatype.boolean(),
        isFromMe: faker.datatype.boolean(),
        isGif: faker.datatype.boolean(),
        isStatus: faker.datatype.boolean(),
        timestamp: dayjs().unix(),
        type: 'text',
        contacts: [makeWAContact()],
        media: makeWAMessageMedia(),
      },
      makeWAMessageID(),
    )

    expect(waMessage).toBeTruthy()
  })
})
