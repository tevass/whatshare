import { makeAttendantProfile } from '@/test/factories/make-attendant-profile'
import { makeContact } from '@/test/factories/make-contact'
import { makeMessageMedia } from '@/test/factories/make-message-media'
import { makeUniqueEntityID } from '@/test/factories/make-unique-entity-id'
import { makeWAEntityID } from '@/test/factories/make-wa-entity-id'
import { makeWAMessageID } from '@/test/factories/make-wa-message-id'
import { Message } from '../message'

describe('Message', () => {
  test('create', () => {
    const message = Message.create({
      chatId: makeUniqueEntityID(),
      type: 'image',
      waChatId: makeWAEntityID(),
      waMessageId: makeWAMessageID(),
      whatsAppId: makeUniqueEntityID(),
      contacts: [makeContact()],
      author: makeContact(),
      senderBy: makeAttendantProfile(),
      revokedBy: makeAttendantProfile(),
      media: makeMessageMedia(),
    })

    expect(message).toBeTruthy()
  })

  test('revoke', () => {
    const message = Message.create({
      chatId: makeUniqueEntityID(),
      type: 'text',
      waChatId: makeWAEntityID(),
      waMessageId: makeWAMessageID(),
      whatsAppId: makeUniqueEntityID(),
    })

    const attendantProfile = makeAttendantProfile()
    message.revoke({ revokedBy: attendantProfile })

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
})
