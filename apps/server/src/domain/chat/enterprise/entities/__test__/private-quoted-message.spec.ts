import { makeMessageMedia } from '@/test/factories/make-message-media'
import { makeUniqueEntityID } from '@/test/factories/make-unique-entity-id'
import { makeWAEntityID } from '@/test/factories/make-wa-entity-id'
import { makeWAMessageID } from '@/test/factories/make-wa-message-id'
import { makeAttendantProfile } from '@/test/factories/value-objects/make-attendant-profile'
import { PrivateQuotedMessage } from '../private-quoted-message'

describe('PrivateQuotedMessage', () => {
  test('create', () => {
    const quotedMessage = PrivateQuotedMessage.create({
      chatId: makeUniqueEntityID(),
      type: 'image',
      waChatId: makeWAEntityID(),
      waMessageId: makeWAMessageID(),
      whatsAppId: makeUniqueEntityID(),
      senderBy: makeAttendantProfile(),
      media: makeMessageMedia(),
    })

    expect(quotedMessage).toBeTruthy()
  })
})
