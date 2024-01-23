import { FakeWhatsAppEmitter } from '@/test/emitters/fake-whats-app-emitter'
import { makeUniqueEntityID } from '@/test/factories/make-unique-entity-id'
import { makeWhatsApp } from '@/test/factories/make-whats-app'
import { InMemoryWhatsAppsRepository } from '@/test/repositories/in-memory-whats-apps-repository'
import { HandleWAConnecting } from '../handle-wa-connecting'
import { WhatsAppStatus } from '@whatshare/core-schemas/enums'
import { FakeWAService } from '@/test/services/fake-wa-service'
import { FakeWAServiceManager } from '@/test/services/fake-wa-service-manager'

let inMemoryWhatsAppsRepository: InMemoryWhatsAppsRepository
let fakeWhatsAppEmitter: FakeWhatsAppEmitter
let fakeWAServiceManager: FakeWAServiceManager

let sut: HandleWAConnecting

describe('HandleWAConnecting', () => {
  beforeEach(() => {
    inMemoryWhatsAppsRepository = new InMemoryWhatsAppsRepository()
    fakeWhatsAppEmitter = new FakeWhatsAppEmitter()
    fakeWAServiceManager = new FakeWAServiceManager()

    sut = new HandleWAConnecting(
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

    expect(response.isRight()).toBe(true)
    if (response.isLeft()) return

    const { whatsApp } = response.value
    expect(whatsApp.status).toBe('connecting' as WhatsAppStatus)
    expect(fakeWhatsAppEmitter.payloads).toHaveLength(1)
  })
})
