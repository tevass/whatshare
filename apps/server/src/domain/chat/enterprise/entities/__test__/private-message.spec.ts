import { makeContact } from '@/test/factories/make-contact'
import { makeMessageMedia } from '@/test/factories/make-message-media'
import { makeUniqueEntityID } from '@/test/factories/make-unique-entity-id'
import { makeWAEntityID } from '@/test/factories/make-wa-entity-id'
import { makeWAMessageID } from '@/test/factories/make-wa-message-id'
import { PrivateMessage } from '../private-message'
import { PrivateQuotedMessage } from '../private-quoted-message'
import { makeAttendantProfile } from '@/test/factories/value-objects/make-attendant-profile'

describe('PrivateMessage', () => {
  test('create', () => {
    const message = PrivateMessage.create({
      chatId: makeUniqueEntityID(),
      type: 'image',
      waChatId: makeWAEntityID(),
      waMessageId: makeWAMessageID(),
      whatsAppId: makeUniqueEntityID(),
      contacts: [makeContact()],
      senderBy: makeAttendantProfile(),
      revokedBy: makeAttendantProfile(),
      media: makeMessageMedia(),
    })

    expect(message).toBeTruthy()
  })

  test('revoke', () => {
    const message = PrivateMessage.create({
      chatId: makeUniqueEntityID(),
      type: 'text',
      waChatId: makeWAEntityID(),
      waMessageId: makeWAMessageID(),
      whatsAppId: makeUniqueEntityID(),
    })

    const attendantProfile = makeAttendantProfile()
    message.revoke(attendantProfile)

    expect(message).toEqual(
      expect.objectContaining({
        revokedBy: attendantProfile,
        revokedAt: expect.any(Date),
        type: 'revoked',
        body: null,
        media: null,
        quoted: null,
        contacts: null,
      }),
    )
  })

  test('toQuoted', () => {
    const message = PrivateMessage.create({
      chatId: makeUniqueEntityID(),
      type: 'image',
      waChatId: makeWAEntityID(),
      waMessageId: makeWAMessageID(),
      whatsAppId: makeUniqueEntityID(),
      contacts: [makeContact()],
      senderBy: makeAttendantProfile(),
      revokedBy: makeAttendantProfile(),
      media: makeMessageMedia(),
    })

    expect(message.toQuoted()).toBeInstanceOf(PrivateQuotedMessage)
  })
})
