import { makeAttendantProfile } from '@/test/factories/make-attendant-profile'
import { makeContact } from '@/test/factories/make-contact'
import { makeMessageMedia } from '@/test/factories/make-message-media'
import { makeUniqueEntityID } from '@/test/factories/make-unique-entity-id'
import { makeWAEntityID } from '@/test/factories/make-wa-entity-id'
import { makeWAMessageID } from '@/test/factories/make-wa-message-id'
import { GroupQuotedMessage } from '../group-quoted-message'

describe('GroupQuotedMessage', () => {
  test('create', () => {
    const quotedMessage = GroupQuotedMessage.create({
      chatId: makeUniqueEntityID(),
      type: 'image',
      waChatId: makeWAEntityID(),
      waMessageId: makeWAMessageID(),
      whatsAppId: makeUniqueEntityID(),
      senderBy: makeAttendantProfile(),
      media: makeMessageMedia(),
      author: makeContact(),
    })

    expect(quotedMessage).toBeTruthy()
  })
})
