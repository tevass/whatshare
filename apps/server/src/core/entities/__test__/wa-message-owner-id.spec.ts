import { makeWAEntityID } from '@/test/factories/make-wa-entity-id'
import { WAMessageOwnerID } from '../wa-message-owner-id'

describe('WAMessageOwnerID', () => {
  test('create', () => {
    const ownerId = new WAMessageOwnerID({
      entityId: makeWAEntityID(),
      ref: 'out',
    })

    expect(ownerId).toBeTruthy()
  })

  test('toString', () => {
    const selfOwnerId = new WAMessageOwnerID({
      entityId: makeWAEntityID(),
      ref: 'out',
    })

    expect(selfOwnerId.toString()).toBe('out')

    const ownerRef = makeWAEntityID().toString()
    const ownerId = new WAMessageOwnerID({
      entityId: makeWAEntityID(),
      ref: ownerRef,
    })

    expect(ownerId.toString()).toBe(ownerRef)
  })
})
