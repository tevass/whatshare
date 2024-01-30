import { makeAttendantProfile } from '@/test/factories/make-attendant-profile'
import { makeContact } from '@/test/factories/make-contact'
import { makeMessageMedia } from '@/test/factories/make-message-media'
import { makeUniqueEntityID } from '@/test/factories/make-unique-entity-id'
import { makeWAEntityID } from '@/test/factories/make-wa-entity-id'
import { makeWAMessageID } from '@/test/factories/make-wa-message-id'
import { GroupMessage } from '../group-message'

describe('GroupMessage', () => {
  test('create', () => {
    const message = GroupMessage.create({
      chatId: makeUniqueEntityID(),
      type: 'image',
      waChatId: makeWAEntityID(),
      waMessageId: makeWAMessageID(),
      whatsAppId: makeUniqueEntityID(),
      contacts: [makeContact()],
      senderBy: makeAttendantProfile(),
      revokedBy: makeAttendantProfile(),
      media: makeMessageMedia(),
      author: makeContact(),
    })

    expect(message).toBeTruthy()
  })

  test('revoke', () => {
    const message = GroupMessage.create({
      chatId: makeUniqueEntityID(),
      type: 'text',
      waChatId: makeWAEntityID(),
      waMessageId: makeWAMessageID(),
      whatsAppId: makeUniqueEntityID(),
      author: makeContact(),
      mentions: Array.from(Array(3)).map(() => makeContact()),
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
        mentions: null,
      }),
    )
  })
})
