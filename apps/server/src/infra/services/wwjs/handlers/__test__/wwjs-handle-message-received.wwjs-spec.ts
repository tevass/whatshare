import { AppModule } from '@/infra/app.module'
import { FakeWhatsAppFactory } from '@/test/factories/make-whats-app'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WAEntityID } from '@/core/entities/wa-entity-id'
import { EnvService } from '@/infra/env/env.service'
import { NestTestingApp } from '@/test/utils/nest-testing-app'
import { WsTestingClient } from '@/test/utils/ws-testing-client'
import { WWJSTesting } from '@/test/utils/wwjs-testing'
import { ChatServerEvents } from '@whatshare/ws-schemas/events'
import { Socket } from 'socket.io-client'
import { WWJSClient } from '../../clients/wwjs-client'
import { WWJSClientManager } from '../../wwjs-client-manager.service'
import { WWJSClientService } from '../../wwjs-client.service'
import { WWJSHandleMessageReceived } from '../wwjs-handle-message-received'

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
      const NEST_TESTING_APP = new NestTestingApp(app)

      const env = moduleRef.get(EnvService)
      const wwjsService = moduleRef.get(WWJSClientService)
      const wwjsManager = moduleRef.get(WWJSClientManager)

      const whatsAppFactory = moduleRef.get(FakeWhatsAppFactory)

      await NEST_TESTING_APP.init()

      const WWJS_TEST_CLIENT_ID = env.get('WWJS_TEST_CLIENT_ID')
      const whatsApp = await whatsAppFactory.makePrismaWhatsApp(
        {},
        new UniqueEntityID(WWJS_TEST_CLIENT_ID),
      )

      wwjsClient = wwjsService.createFromWhatsApp(whatsApp)
      wwjsClient.addHandlers([moduleRef.get(WWJSHandleMessageReceived)])
      wwjsManager.clients.set(whatsApp.id.toString(), wwjsClient)

      const WWJS_TEST_HELPER_CLIENT_ID = env.get('WWJS_TEST_HELPER_CLIENT_ID')
      const helperWhatsApp = await whatsAppFactory.makePrismaWhatsApp(
        {},
        new UniqueEntityID(WWJS_TEST_HELPER_CLIENT_ID),
      )

      helperWWJSClient = wwjsService.createFromWhatsApp(helperWhatsApp)
      wwjsManager.clients.set(helperWhatsApp.id.toString(), helperWWJSClient)

      socket = WsTestingClient.create({
        address: WsTestingClient.waAddress(NEST_TESTING_APP.getAddress(app)),
        cookie: NEST_TESTING_APP.getAuthCookie('@test'),
        room: whatsApp.id.toString(),
      })

      return new Promise((resolve, reject) => {
        socket.on('connect', () => {
          Promise.all([wwjsClient.init(), helperWWJSClient.init()])
            .then(() => resolve())
            .catch(reject)
        })

        socket.on('connect_error', reject)
      })
    },
    1000 * 60 * 1,
  ) // 1 minute

  afterEach(async () => {
    const wwjsClientRaw = wwjsClient.switchToRaw()
    const wwjsHelperClientRaw = wwjsClient.switchToRaw()

    await WWJSTesting.clearChat(
      wwjsClientRaw,
      wwjsHelperClientRaw.info.wid._serialized,
    )
    await WWJSTesting.clearChat(
      wwjsHelperClientRaw,
      wwjsClientRaw.info.wid._serialized,
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
