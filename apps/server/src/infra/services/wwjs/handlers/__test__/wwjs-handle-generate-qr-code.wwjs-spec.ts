import { UniqueEntityID } from '@/core/entities/unique-entity-id'
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

type SocketEvents = WhatsAppServerEvents & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [event: string]: (...args: any[]) => void
}

describe('Handle Generate QR Code (WWJS)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let whatsAppFactory: FakeWhatsAppFactory

  let whatsApp: WhatsApp
  let socket: Socket<SocketEvents>

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [FakeWhatsAppFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
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
      socket.on('join', resolve)
      socket.on('error', reject)
      socket.on('exception', reject)
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
