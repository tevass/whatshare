import { FakeWhatsAppEmitter } from '@/test/emitters/fake-whats-app-emitter'
import { makeUniqueEntityID } from '@/test/factories/make-unique-entity-id'
import { makeWhatsApp } from '@/test/factories/make-whats-app'
import { InMemoryWhatsAppsRepository } from '@/test/repositories/in-memory-whats-apps-repository'
import { HandleWAConnected } from '../handle-wa-connected'
import { FakeWAClientManager } from '@/test/services/fake-wa-client-manager'
import { FakeWAClient } from '@/test/services/fake-wa-client-manager/clients/fake-wa-client'

let inMemoryWhatsAppsRepository: InMemoryWhatsAppsRepository
let fakeWhatsAppEmitter: FakeWhatsAppEmitter
let fakeWAClientManager: FakeWAClientManager

let sut: HandleWAConnected

describe('HandleWAConnected', () => {
  beforeEach(() => {
    inMemoryWhatsAppsRepository = new InMemoryWhatsAppsRepository()
    fakeWhatsAppEmitter = new FakeWhatsAppEmitter()
    fakeWAClientManager = new FakeWAClientManager()

    sut = new HandleWAConnected(
      inMemoryWhatsAppsRepository,
      fakeWhatsAppEmitter,
      fakeWAClientManager,
    )
  })

  it('should be able to connect whats-app', async () => {
    const whatsAppId = makeUniqueEntityID()

    const _whatsApp = makeWhatsApp({}, whatsAppId)

    fakeWAClientManager.clients.set(
      whatsAppId.toString(),
      FakeWAClient.createFromWhatsApp(_whatsApp),
    )
    inMemoryWhatsAppsRepository.items.push(_whatsApp)

    const response = await sut.execute({
      whatsAppId: whatsAppId.toString(),
    })

    expect(response.isRight()).toBe(true)
    if (response.isLeft()) return

    const { whatsApp } = response.value
    expect(whatsApp.isConnected()).toBe(true)
    expect(fakeWhatsAppEmitter.payloads).toHaveLength(1)
  })
})
