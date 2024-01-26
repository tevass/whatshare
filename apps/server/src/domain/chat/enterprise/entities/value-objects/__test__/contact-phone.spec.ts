import { faker } from '@faker-js/faker'
import { ContactPhone } from '../contact-phone'

describe('ContactPhone', () => {
  test('create', () => {
    const phone = ContactPhone.create({
      number: faker.phone.number(),
      formattedNumber: faker.phone.number(),
    })

    expect(phone).toBeTruthy()
  })

  test('format', () => {
    const formattedPhone = ContactPhone.format(
      faker.helpers.fromRegExp(/[0-9]{13}/),
    )

    expect(formattedPhone).toMatch(/\+\d{2} \d{2} \d{5}-\d{4}/)
  })

  test('toString', () => {
    const phone = ContactPhone.create({
      number: faker.helpers.fromRegExp(/[0-9]{13}/),
      formattedNumber: faker.phone.number(),
    })

    expect(phone.toString()).toBe(ContactPhone.format(phone.number))
  })
})
