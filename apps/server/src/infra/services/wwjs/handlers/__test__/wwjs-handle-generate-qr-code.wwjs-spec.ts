import { WhatsApp } from '@/domain/chat/enterprise/entities/whats-app'
import { AppModule } from '@/infra/app.module'
import { FakeWhatsAppFactory } from '@/test/factories/make-whats-app'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { Socket } from 'socket.io-client'

import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { NestTestingApp } from '@/test/utils/nest-testing-app'
import { WsTestingClient } from '@/test/utils/ws-testing-client'
import { WhatsAppServerEvents } from '@whatshare/ws-schemas/events'
import { WWJSClientManager } from '../../wwjs-client-manager.service'
import { WWJSClientService } from '../../wwjs-client.service'
import { WWJSHandleGenerateQrCode } from '../wwjs-handle-generate-qr-code'

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
    const NEST_TESTING_APP = new NestTestingApp(app)

    prisma = moduleRef.get(PrismaService)
    const wwjsManager = moduleRef.get(WWJSClientManager)
    const wwjsService = moduleRef.get(WWJSClientService)
    const whatsAppFactory = moduleRef.get(FakeWhatsAppFactory)

    await NEST_TESTING_APP.init()

    whatsApp = await whatsAppFactory.makePrismaWhatsApp()

    const wwjsClient = wwjsService.createFromWhatsApp(whatsApp)
    wwjsClient.addHandlers([moduleRef.get(WWJSHandleGenerateQrCode)])
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
