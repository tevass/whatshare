import { WhatsApp } from '@/domain/chat/enterprise/entities/whats-app'
import { AppModule } from '@/infra/app.module'
import { FakeWhatsAppFactory } from '@/test/factories/make-whats-app'
import { Server } from '@/test/utils/server'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import cookieParser from 'cookie-parser'
import { Socket, io } from 'socket.io-client'

import { WhatsAppServerEvents } from '@whatshare/ws-schemas/events'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { WhatsAppStatus as PrismaWhatsAppStatus } from '@prisma/client'
import { WWJSService } from '../../wwjs.service'

/**
 * Issue/Pull about the disconnected event not fired on log out
 * https://github.com/pedroslopez/whatsapp-web.js/pull/2661
 */

describe('Handle Disconnected (WWJS)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let wwjsService: WWJSService
  let whatsAppFactory: FakeWhatsAppFactory

  let whatsApp: WhatsApp
  let socket: Socket<WhatsAppServerEvents>

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [FakeWhatsAppFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    wwjsService = moduleRef.get(WWJSService)
    whatsAppFactory = app.get(FakeWhatsAppFactory)

    app.use(cookieParser)

    whatsApp = await whatsAppFactory.makeWWJSWhatsApp()

    await app.init()

    const address = Server.getAddressFromApp(app)
    socket = io(`${address}/wa`, {
      extraHeaders: {
        'whatshare-room-id': whatsApp.id.toString(),
      },
    })

    return new Promise((resolve, reject) => {
      socket.on('connect', resolve)
      socket.on('connect_error', reject)
    })
  })

  afterAll(async () => {
    await app.close()
  })

  it('[EVENT] DISCONNECTED', async () => {
    return new Promise((resolve) => {
      const _whatsApp = whatsApp

      socket.on('whatsApp:connected', async () => {
        const wwjsClient = wwjsService.get(_whatsApp.id)
        if (!wwjsClient) throw new Error('Not found WWJSClient')

        socket.on('whatsApp:disconnected', async ({ whatsApp }) => {
          const whatsAppOnDatabase = await prisma.whatsApp.findUniqueOrThrow({
            where: { id: whatsApp.id },
          })

          resolve([
            expect(wwjsClient.isDisconnected()).toBe(true),
            expect(whatsApp.isDisconnected).toBe(true),
            expect(whatsAppOnDatabase.status).toBe(
              'disconnected' as PrismaWhatsAppStatus,
            ),
          ])
        })

        await wwjsClient.logout()
      })
    })
  })
})
