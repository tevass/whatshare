import { faker } from '@faker-js/faker'
import { WhatsApp } from '../whats-app'

describe('WhatsApp', () => {
  test('create', () => {
    const whatsApp = WhatsApp.create({
      name: faker.company.name(),
    })

    expect(whatsApp).toBeTruthy()
  })
})
