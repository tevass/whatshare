import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WhatsApp } from '@/domain/chat/enterprise/entities/whats-app'
import { AppModule } from '@/infra/app.module'
import { FakeWhatsAppFactory } from '@/test/factories/make-whats-app'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { Socket } from 'socket.io-client'

import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { EnvService } from '@/infra/env/env.service'
import { NestTestingApp } from '@/test/utils/nest-testing-app'
import { WsTestingClient } from '@/test/utils/ws-testing-client'
import { WhatsAppStatus } from '@whatshare/core-schemas/enums'
import { WhatsAppServerEvents } from '@whatshare/ws-schemas/events'
import { WWJSClient } from '../../clients/wwjs-client'
import { WWJSClientManager } from '../../wwjs-client-manager.service'
import { WWJSClientService } from '../../wwjs-client.service'
import { WWJSHandleLoadingScreen } from '../wwjs-handle-loading-screen'
import { WWJSHandleReady } from '../wwjs-handle-ready'

describe('Handle Loading Screen (WWJS)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let env: EnvService

  let whatsApp: WhatsApp

  let socket: Socket<WhatsAppServerEvents>
  let wwjsClient: WWJSClient

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [FakeWhatsAppFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    const NEST_TESTING_APP = new NestTestingApp(app)

    prisma = moduleRef.get(PrismaService)
    env = moduleRef.get(EnvService)
    const wwjsManager = moduleRef.get(WWJSClientManager)
    const wwjsService = moduleRef.get(WWJSClientService)

    const whatsAppFactory = moduleRef.get(FakeWhatsAppFactory)

    await NEST_TESTING_APP.init()

    const WWJS_TEST_CLIENT_ID = env.get('WWJS_TEST_CLIENT_ID')
    whatsApp = await whatsAppFactory.makePrismaWhatsApp(
      {},
      new UniqueEntityID(WWJS_TEST_CLIENT_ID),
    )

    wwjsClient = wwjsService.createFromWhatsApp(whatsApp)
    wwjsClient.addHandlers([
      moduleRef.get(WWJSHandleLoadingScreen),
      moduleRef.get(WWJSHandleReady),
    ])
    wwjsManager.clients.set(whatsApp.id.toString(), wwjsClient)

    socket = WsTestingClient.create({
      address: WsTestingClient.waAddress(NEST_TESTING_APP.getAddress(app)),
      cookie: NEST_TESTING_APP.getAuthCookie('@test'),
      room: whatsApp.id.toString(),
    })

    wwjsClient.init()

    return new Promise((resolve, reject) => {
      socket.on('connect', resolve)
      socket.on('connect_error', reject)
    })
  })

  afterAll(async () => {
    await app.close()
  })

  it('[EVENT] LOADING SCREEN', async () => {
    return new Promise((resolve) => {
      socket.on('whatsApp:change', async ({ whatsApp }) => {
        const whatsAppOnDatabase = await prisma.whatsApp.findUniqueOrThrow({
          where: { id: whatsApp.id },
        })

        const wwjsClientStatus = wwjsClient.status

        socket.on('whatsApp:connected', () => {
          resolve([
            expect(wwjsClientStatus).toBe('connecting' as WhatsAppStatus),
            expect(whatsAppOnDatabase.status).toBe(
              'connecting' as WhatsAppStatus,
            ),
          ])
        })
      })
    })
  })
})
