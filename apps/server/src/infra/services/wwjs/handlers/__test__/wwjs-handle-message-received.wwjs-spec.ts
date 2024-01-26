import { AppModule } from '@/infra/app.module'
import { FakeWhatsAppFactory } from '@/test/factories/make-whats-app'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import cookieParser from 'cookie-parser'

import { afterAll } from 'vitest'
import { WWJSClient } from '../../clients/wwjs-client'
import { Socket, io } from 'socket.io-client'
import { EnvService } from '@/infra/env/env.service'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WWJSClientService } from '../../wwjs-client.service'
import { WWJSClientManager } from '../../wwjs-client-manager.service'
import { Server } from '@/test/utils/server'
import { Time } from '@/infra/utils/time'
import { WAEntityID } from '@/core/entities/wa-entity-id'
import { ChatServerEvents } from '@whatshare/ws-schemas/events'

describe('Handle Message Received (WWJS)', () => {
  let app: INestApplication

  let socket: Socket<ChatServerEvents>

  let wwjsClient: WWJSClient
  let helperWWJSClient: WWJSClient

  beforeEach(
    async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [AppModule],
        providers: [FakeWhatsAppFactory],
      }).compile()

      app = moduleRef.createNestApplication()
      const env = moduleRef.get(EnvService)

      const wwjsService = moduleRef.get(WWJSClientService)
      const wwjsManager = moduleRef.get(WWJSClientManager)

      const whatsAppFactory = moduleRef.get(FakeWhatsAppFactory)

      app.use(cookieParser)
      await app.init()

      const WWJS_TEST_CLIENT_ID = env.get('WWJS_TEST_CLIENT_ID')
      const whatsApp = await whatsAppFactory.makePrismaWhatsApp(
        {},
        new UniqueEntityID(WWJS_TEST_CLIENT_ID),
      )

      wwjsClient = wwjsService.createFromWhatsApp(whatsApp)
      wwjsService.registerHandlersInClient(wwjsClient)
      wwjsManager.clients.set(whatsApp.id.toString(), wwjsClient)

      const WWJS_TEST_HELPER_CLIENT_ID = env.get('WWJS_TEST_HELPER_CLIENT_ID')
      const helperWhatsApp = await whatsAppFactory.makePrismaWhatsApp(
        {},
        new UniqueEntityID(WWJS_TEST_HELPER_CLIENT_ID),
      )

      helperWWJSClient = wwjsService.createFromWhatsApp(helperWhatsApp)
      wwjsManager.clients.set(helperWhatsApp.id.toString(), helperWWJSClient)

      const address = Server.getAddressFromApp(app)
      socket = io(`${address}/wa`, {
        query: {
          room: whatsApp.id.toString(),
        },
      })

      return new Promise((resolve, reject) => {
        socket.on('connect', () => {
          Promise.all([wwjsClient.init(), helperWWJSClient.init()]).then(() =>
            resolve(),
          )
        })

        socket.on('connect_error', reject)
      })
    },
    1000 * 60 * 1,
  ) // 1 minute

  afterEach(async () => {
    const wwjsRawClient = wwjsClient.switchToRaw()
    const helperWWJSRawClient = helperWWJSClient.switchToRaw()

    const chats = await Promise.all([
      wwjsRawClient.getChatById(helperWWJSRawClient.info.wid._serialized),
      helperWWJSRawClient.getChatById(wwjsRawClient.info.wid._serialized),
    ])

    await Promise.all(
      chats.map(async (chat) => {
        await chat.delete()
        await Time.delay()
      }),
    )
  })

  afterAll(async () => {
    await app.close()
  })

  it('[EVENT] MESSAGE_RECEIVED', async () => {
    const wwjsClientWAId = WAEntityID.createFromString(
      wwjsClient.switchToRaw().info.wid._serialized,
    )

    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      socket.on('chat:create', resolve)
      await helperWWJSClient.message.sendText({
        chatId: wwjsClientWAId,
        body: '@test',
      })
    })
  })
})
