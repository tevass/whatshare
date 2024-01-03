import { FakeWhatsAppEmitter } from '@/test/emitters/fake-whats-app-emitter'
import { makeUniqueEntityID } from '@/test/factories/make-unique-entity-id'
import { makeWhatsApp } from '@/test/factories/make-whats-app'
import { InMemoryWhatsAppsRepository } from '@/test/repositories/in-memory-whats-apps-repository'
import { faker } from '@faker-js/faker'
import { HandleWAGenerateQRCode } from '../handle-wa-generate-qr-code'

let inMemoryWhatsAppsRepository: InMemoryWhatsAppsRepository
let fakeWhatsAppEmitter: FakeWhatsAppEmitter

let sut: HandleWAGenerateQRCode

describe('HandleWAGenerateQRCode', () => {
  beforeEach(() => {
    inMemoryWhatsAppsRepository = new InMemoryWhatsAppsRepository()
    fakeWhatsAppEmitter = new FakeWhatsAppEmitter()

    sut = new HandleWAGenerateQRCode(
      inMemoryWhatsAppsRepository,
      fakeWhatsAppEmitter,
    )
  })

  it('should be able to change qr-code of whats-app', async () => {
    const whatsAppId = makeUniqueEntityID()

    inMemoryWhatsAppsRepository.items.push(makeWhatsApp({}, whatsAppId))

    const response = await sut.execute({
      qrCode: faker.string.hexadecimal(),
      whatsAppId: whatsAppId.toString(),
    })

    expect(response.isRight()).toBe(true)
    if (response.isLeft()) return

    const { whatsApp } = response.value
    expect(whatsApp.qrCode).toEqual(expect.any(String))
    expect(fakeWhatsAppEmitter.events).toHaveLength(2)
  })
})
