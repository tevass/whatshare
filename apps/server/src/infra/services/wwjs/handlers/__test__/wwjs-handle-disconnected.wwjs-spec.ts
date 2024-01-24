import { WhatsApp } from '@/domain/chat/enterprise/entities/whats-app'
import { AppModule } from '@/infra/app.module'
import { FakeWhatsAppFactory } from '@/test/factories/make-whats-app'
import { Server } from '@/test/utils/server'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import cookieParser from 'cookie-parser'
import { Socket, io } from 'socket.io-client'

import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { WhatsAppStatus } from '@whatshare/core-schemas/enums'
import { WhatsAppServerEvents } from '@whatshare/ws-schemas/events'
import { WWJSClientManager } from '../../wwjs-client-manager.service'
import { WWJSClient } from '../../clients/wwjs-client'

/**
 * Issue/Pull about the disconnected event not fired on logout
 *
 * https://github.com/pedroslopez/whatsapp-web.js/pull/2661
 */

describe('Handle Disconnected (WWJS)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let wwjsManager: WWJSClientManager

  let whatsApp: WhatsApp

  let socket: Socket<WhatsAppServerEvents>
  let wwjsClient: WWJSClient

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [FakeWhatsAppFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    wwjsManager = moduleRef.get(WWJSClientManager)
    const whatsAppFactory = app.get(FakeWhatsAppFactory)

    whatsApp = await whatsAppFactory.makePrismaWhatsApp()

    app.use(cookieParser)
    await app.init()

    wwjsClient = wwjsManager.clients.get(whatsApp.id.toString())!

    const address = Server.getAddressFromApp(app)
    socket = io(`${address}/wa`, {
      query: {
        room: whatsApp.id.toString(),
      },
    })

    return new Promise((resolve, reject) => {
      socket.on('connect', () => {
        socket.on('whatsApp:connected', () => resolve())
      })

      socket.on('connect_error', reject)
    })
  }, 1000 * 30) // 30 seconds

  afterAll(async () => {
    await app.close()
  })

  it('[EVENT] DISCONNECTED', async () => {
    return new Promise((resolve) => {
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

      wwjsClient.logout()
    })
  })
})
