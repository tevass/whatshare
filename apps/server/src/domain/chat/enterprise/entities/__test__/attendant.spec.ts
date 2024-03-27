import { makeAttendantProfile } from '@/test/factories/value-objects/make-attendant-profile'
import { Attendant } from '../attendant'

describe('Attendant', () => {
  test('create', () => {
    const attendant = Attendant.create({
      profile: makeAttendantProfile(),
    })

    expect(attendant).toBeTruthy()
  })

  test('hasPassword', () => {
    const attendant = Attendant.create({
      profile: makeAttendantProfile(),
      password: '12345',
    })

    expect(attendant.hasPassword()).toBe(true)
  })
})
