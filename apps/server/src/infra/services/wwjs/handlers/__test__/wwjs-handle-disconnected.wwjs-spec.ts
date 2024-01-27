import { WhatsApp } from '@/domain/chat/enterprise/entities/whats-app'
import { AppModule } from '@/infra/app.module'
import { FakeWhatsAppFactory } from '@/test/factories/make-whats-app'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { Socket } from 'socket.io-client'

import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { NestTestingApp } from '@/test/utils/nest-testing-app'
import { WsTestingClient } from '@/test/utils/ws-testing-client'
import { WhatsAppStatus } from '@whatshare/core-schemas/enums'
import { WhatsAppServerEvents } from '@whatshare/ws-schemas/events'
import { WWJSClient } from '../../clients/wwjs-client'
import { WWJSClientManager } from '../../wwjs-client-manager.service'
import { WWJSClientService } from '../../wwjs-client.service'
import { WWJSHandleDisconnected } from '../wwjs-handle-disconnected'

/**
 * Issue/Pull about the disconnected event not fired on logout
 *
 * https://github.com/pedroslopez/whatsapp-web.js/pull/2661
 */

describe('Handle Disconnected (WWJS)', () => {
  let app: INestApplication
  let prisma: PrismaService

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
    const wwjsManager = moduleRef.get(WWJSClientManager)
    const wwjsService = moduleRef.get(WWJSClientService)
    const whatsAppFactory = moduleRef.get(FakeWhatsAppFactory)

    await NEST_TESTING_APP.init()

    whatsApp = await whatsAppFactory.makePrismaWhatsApp()

    wwjsClient = wwjsService.createFromWhatsApp(whatsApp)
    wwjsClient.addHandlers([moduleRef.get(WWJSHandleDisconnected)])
    wwjsManager.clients.set(whatsApp.id.toString(), wwjsClient)

    socket = WsTestingClient.create({
      address: WsTestingClient.waAddress(NEST_TESTING_APP.getAddress(app)),
      cookie: NEST_TESTING_APP.getAuthCookie('@test'),
      room: whatsApp.id.toString(),
    })

    return new Promise((resolve, reject) => {
      socket.on('connect', () => {
        wwjsClient.init().then(resolve)
      })

      socket.on('connect_error', reject)
    })
  }, 1000 * 30) // 30 seconds

  afterAll(async () => {
    await app.close()
  })

  it('[EVENT] DISCONNECTED', async () => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      socket.on('whatsApp:disconnected', async ({ whatsApp }) => {
        const whatsAppOnDatabase = await prisma.whatsApp.findUniqueOrThrow({
          where: { id: whatsApp.id },
        })

        resolve([
          expect(wwjsClient.isDisconnected()).toBe(true),
          expect(whatsApp.isDisconnected).toBe(true),
          expect(whatsAppOnDatabase.status).toBe(
            'disconnected' as WhatsAppStatus,
          ),
        ])
      })

      await wwjsClient.logout()
    })
  })
})
