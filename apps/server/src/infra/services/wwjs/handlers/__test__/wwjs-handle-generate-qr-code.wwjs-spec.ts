import { WhatsApp } from '@/domain/chat/enterprise/entities/whats-app'
import { AppModule } from '@/infra/app.module'
import { FakeWhatsAppFactory } from '@/test/factories/make-whats-app'
import { Server } from '@/test/utils/server'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import cookieParser from 'cookie-parser'
import { Socket, io } from 'socket.io-client'

import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { WhatsAppServerEvents } from '@whatshare/ws-schemas/events'

describe('Handle Generate QR Code (WWJS)', () => {
  let app: INestApplication
  let prisma: PrismaService

  let whatsApp: WhatsApp
  let socket: Socket<WhatsAppServerEvents>

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [FakeWhatsAppFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    const whatsAppFactory = moduleRef.get(FakeWhatsAppFactory)

    whatsApp = await whatsAppFactory.makePrismaWhatsApp()

    app.use(cookieParser)
    await app.init()

    const address = Server.getAddressFromApp(app)
    socket = io(`${address}/wa`, {
      query: {
        room: whatsApp.id.toString(),
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

  it('[EVENT] QR_RECEIVED', async () => {
    return new Promise((resolve) => {
      socket.on('whatsApp:qrCode', async ({ whatsApp }) => {
        const whatsAppOnDatabase = await prisma.whatsApp.findUniqueOrThrow({
          where: { id: whatsApp.id },
        })

        resolve([
          expect(whatsApp.qrCode).toEqual(expect.any(String)),
          expect(whatsAppOnDatabase.qrCode).toBeTruthy(),
        ])
      })
    })
  })
})
