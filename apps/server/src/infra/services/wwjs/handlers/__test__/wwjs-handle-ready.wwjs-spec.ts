import { UniqueEntityID } from '@/core/entities/unique-entity-id'
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
import { WWJSService } from '../../wwjs.service'

describe('Handle Ready (WWJS)', () => {
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

    whatsApp = await whatsAppFactory.makeWWJSWhatsApp(
      {},
      new UniqueEntityID('65afb96e1f5c3cda590f04e4'),
    )

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

  it('[EVENT] READY', async () => {
    return new Promise((resolve, reject) => {
      const _whatsApp = whatsApp

      socket.on('whatsApp:connected', async ({ whatsApp }) => {
        const whatsAppOnDatabase = await prisma.whatsApp.findUniqueOrThrow({
          where: { id: whatsApp.id },
        })

        const wwjsClient = wwjsService.get(_whatsApp.id)
        if (!wwjsClient) return reject(new Error('Not found WWJSClient'))

        resolve([
          expect(wwjsClient.isConnected()).toBe(true),
          expect(whatsApp.isConnected).toBe(true),
          expect(whatsAppOnDatabase.status).toBe('connected' as WhatsAppStatus),
        ])
      })
    })
  })
})
