import { FakeWhatsAppEmitter } from '@/test/emitters/fake-whats-app-emitter'
import { makeUniqueEntityID } from '@/test/factories/make-unique-entity-id'
import { makeWhatsApp } from '@/test/factories/make-whats-app'
import { InMemoryWhatsAppsRepository } from '@/test/repositories/in-memory-whats-apps-repository'
import { HandleWAConnected } from '../handle-wa-connected'
import { FakeWAServiceManager } from '@/test/services/fake-wa-service-manager'
import { FakeWAService } from '@/test/services/fake-wa-service'

let inMemoryWhatsAppsRepository: InMemoryWhatsAppsRepository
let fakeWhatsAppEmitter: FakeWhatsAppEmitter
let fakeWAServiceManager: FakeWAServiceManager

let sut: HandleWAConnected

describe('HandleWAConnected', () => {
  beforeEach(() => {
    inMemoryWhatsAppsRepository = new InMemoryWhatsAppsRepository()
    fakeWhatsAppEmitter = new FakeWhatsAppEmitter()
    fakeWAServiceManager = new FakeWAServiceManager()

    sut = new HandleWAConnected(
      inMemoryWhatsAppsRepository,
      fakeWhatsAppEmitter,
      fakeWAServiceManager,
    )
  })

  it('should be able to connect whats-app', async () => {
    const whatsAppId = makeUniqueEntityID()

    const _whatsApp = makeWhatsApp({}, whatsAppId)

    fakeWAServiceManager.services.set(
      whatsAppId.toString(),
      FakeWAService.createFromWhatsApp(_whatsApp),
    )
    inMemoryWhatsAppsRepository.items.push(_whatsApp)

    const response = await sut.execute({
      whatsAppId: whatsAppId.toString(),
    })

    console.log(response.value)

    // expect(response.isRight()).toBe(true)
    // if (response.isLeft()) return

    // const { whatsApp } = response.value
    // expect(whatsApp.isConnected()).toBe(true)
    // expect(fakeWhatsAppEmitter.payloads).toHaveLength(1)
  })
})
