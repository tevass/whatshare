import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WAEntityID } from '@/core/entities/wa-entity-id'
import { WhatsApp } from '@/domain/chat/enterprise/entities/whats-app'
import { AppModule } from '@/infra/app.module'
import { EnvService } from '@/infra/env/env.service'
import { Time } from '@/infra/utils/time'
import { FakeContactFactory } from '@/test/factories/make-contact'
import { FakeWhatsAppFactory } from '@/test/factories/make-whats-app'
import { makeMessageBody } from '@/test/factories/value-objects/make-message-body'
import { NestTestingApp } from '@/test/utils/nest-testing-app'
import { WsTestingClient } from '@/test/utils/ws-testing-client'
import { WWJSTesting } from '@/test/utils/wwjs-testing'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { MessageServerEvents } from '@whatshare/ws-schemas/events'
import { Socket } from 'socket.io-client'
import { WWJSClient } from '../../clients/wwjs-client'
import { WWJSClientManager } from '../../wwjs-client-manager.service'
import { WWJSClientService } from '../../wwjs-client.service'
import { WWJSHandleMessageAck } from '../wwjs-handle-message-ack'
import { FakePrivateChatFactory } from '@/test/factories/make-private-chat'
import { FakePrivateMessageFactory } from '@/test/factories/make-private-message'

describe('Handle Message Ack (WWJS)', () => {
  let app: INestApplication

  let contactFactory: FakeContactFactory
  let privateChatFactory: FakePrivateChatFactory
  let privateMessageFactory: FakePrivateMessageFactory

  let whatsApp: WhatsApp
  let socket: Socket<MessageServerEvents>

  let wwjsClient: WWJSClient
  let helperWWJSClient: WWJSClient

  beforeEach(
    async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [AppModule],
        providers: [
          FakeWhatsAppFactory,
          FakeContactFactory,
          FakePrivateChatFactory,
          FakePrivateMessageFactory,
        ],
      }).compile()

      app = moduleRef.createNestApplication()
      const NEST_TESTING_APP = new NestTestingApp(app)

      const env = moduleRef.get(EnvService)

      contactFactory = moduleRef.get(FakeContactFactory)
      privateChatFactory = moduleRef.get(FakePrivateChatFactory)
      privateMessageFactory = moduleRef.get(FakePrivateMessageFactory)

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
      wwjsClient.addHandlers([moduleRef.get(WWJSHandleMessageAck)])
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
    1000 * 60 * 1, // 1 minute
  )

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

  it('[EVENT] MESSAGE_ACK', async () => {
    const helperWWJSClientWAId = WAEntityID.createFromString(
      helperWWJSClient.switchToRaw().info.wid._serialized,
    )

    const contact = await contactFactory.makePrismaContact({
      waContactId: helperWWJSClientWAId,
    })

    const chat = await privateChatFactory.makePrismaPrivateChat({
      waChatId: helperWWJSClientWAId,
      whatsAppId: whatsApp.id,
      contact,
      unreadCount: 0,
    })

    const waMessage = await wwjsClient.message.sendText({
      chatId: helperWWJSClientWAId,
      body: '@test',
    })

    await privateMessageFactory.makePrismaPrivateMessage({
      waMessageId: waMessage.id,
      type: 'text',
      ack: 'sent',
      whatsAppId: whatsApp.id,
      chatId: chat.id,
      waChatId: chat.waChatId,
      body: makeMessageBody({ content: waMessage.body! }),
    })

    return new Promise((resolve) => {
      socket.on('message:change', async () => {
        resolve(await Time.delay())
      })
    })
  })
})
