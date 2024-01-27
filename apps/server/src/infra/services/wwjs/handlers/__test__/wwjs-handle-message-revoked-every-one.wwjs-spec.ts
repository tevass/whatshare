import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WAEntityID } from '@/core/entities/wa-entity-id'
import { DateAdapter } from '@/domain/chat/application/adapters/date-adapter'
import { WhatsApp } from '@/domain/chat/enterprise/entities/whats-app'
import { AppModule } from '@/infra/app.module'
import { EnvService } from '@/infra/env/env.service'
import { FakeDateAdapter } from '@/test/adapters/fake-date-adapter'
import { FakeChatFactory } from '@/test/factories/make-chat'
import { FakeContactFactory } from '@/test/factories/make-contact'
import { FakeMessageFactory } from '@/test/factories/make-message'
import { FakeWhatsAppFactory } from '@/test/factories/make-whats-app'
import { makeMessageBody } from '@/test/factories/value-objects/make-message-body'
import { NestTestingApp } from '@/test/utils/nest-testing-app'
import { WsTestingClient } from '@/test/utils/ws-testing-client'
import { WWJSTesting } from '@/test/utils/wwjs-testing'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { MessageType } from '@whatshare/core-schemas/enums'
import { MessageServerEvents } from '@whatshare/ws-schemas/events'
import { Socket } from 'socket.io-client'
import { WWJSClient } from '../../clients/wwjs-client'
import { WWJSClientManager } from '../../wwjs-client-manager.service'
import { WWJSClientService } from '../../wwjs-client.service'
import { WWJSHandleMessageRevokedEveryone } from '../wwjs-handle-message-revoke-everyone'

describe('Handle Revoked Every One (WWJS)', () => {
  let app: INestApplication

  let contactFactory: FakeContactFactory
  let chatFactory: FakeChatFactory
  let messageFactory: FakeMessageFactory
  let dateAdapter: FakeDateAdapter

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
          FakeChatFactory,
          FakeMessageFactory,
          FakeDateAdapter,
        ],
      }).compile()

      app = moduleRef.createNestApplication()
      const NEST_TESTING_APP = new NestTestingApp(app)

      dateAdapter = moduleRef.get(DateAdapter)
      const env = moduleRef.get(EnvService)

      contactFactory = moduleRef.get(FakeContactFactory)
      chatFactory = moduleRef.get(FakeChatFactory)
      messageFactory = moduleRef.get(FakeMessageFactory)

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
      wwjsClient.addHandlers([moduleRef.get(WWJSHandleMessageRevokedEveryone)])
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
    await WWJSTesting.clearChats({
      client: wwjsClient.switchToRaw(),
      helper: helperWWJSClient.switchToRaw(),
    })
  })

  afterAll(async () => {
    await app.close()
  })

  it('[EVENT] MESSAGE_REVOKED_EVERYONE', async () => {
    const helperWWJSClientWAId = WAEntityID.createFromString(
      helperWWJSClient.switchToRaw().info.wid._serialized,
    )

    const contact = await contactFactory.makePrismaContact({
      waContactId: helperWWJSClientWAId,
    })

    const chat = await chatFactory.makePrismaChat({
      waChatId: helperWWJSClientWAId,
      whatsAppId: whatsApp.id,
      contact,
      unreadCount: 0,
    })

    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      socket.on('message:revoked', ({ message }) => {
        resolve([
          expect(message.revokedAt).toBeTruthy(),
          expect(message.type).toBe('revoked' as MessageType),
        ])
      })

      socket.on('message:change', async ({ message }) => {
        if (message.ack === 'sent') {
          const wwjsChat = await wwjsClient
            .switchToRaw()
            .getChatById(helperWWJSClientWAId.toString())

          const wwjsMessage = (
            await wwjsChat.fetchMessages({
              fromMe: true,
              limit: 1,
            })
          )[0]

          await wwjsMessage.delete(true)
        }
      })

      const waMessage = await wwjsClient.message.sendText({
        chatId: helperWWJSClientWAId,
        body: '@test',
      })

      await messageFactory.makePrismaMessage({
        waMessageId: waMessage.id,
        type: 'text',
        ack: 'pending',
        whatsAppId: whatsApp.id,
        chatId: chat.id,
        waChatId: chat.waChatId,
        body: makeMessageBody({ content: waMessage.body! }),
        createdAt: dateAdapter.fromUnix(waMessage.timestamp).toDate(),
      })
    })
  })
})
