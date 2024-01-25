import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WhatsApp } from '@/domain/chat/enterprise/entities/whats-app'
import { AppModule } from '@/infra/app.module'
import { EnvService } from '@/infra/env/env.service'
import { FakeWhatsAppFactory } from '@/test/factories/make-whats-app'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import cookieParser from 'cookie-parser'
import { WWJSClient } from '../../clients/wwjs-client'
import { WWJSClientManager } from '../../wwjs-client-manager.service'
import { WWJSClientService } from '../../wwjs-client.service'
import { Server } from '@/test/utils/server'
import { Socket, io } from 'socket.io-client'
import { WAEntityID } from '@/core/entities/wa-entity-id'
import { FakeContactFactory } from '@/test/factories/make-contact'
import { FakeChatFactory } from '@/test/factories/make-chat'
import { FakeMessageFactory } from '@/test/factories/make-message'
import { MessageServerEvents } from '@whatshare/ws-schemas/events'
import { makeMessageBody } from '@/test/factories/value-objects/make-message-body'
import { Time } from '@/infra/utils/time'

/**
 * For the MESSAGE_ACK event to be fired, active read confirmation is required
 *
 * Enable it in Settings > Privacy > Read confirmation
 */

describe('Handle Unread Count (WWJS)', () => {
  let app: INestApplication

  let contactFactory: FakeContactFactory
  let chatFactory: FakeChatFactory
  let messageFactory: FakeMessageFactory

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
        ],
      }).compile()

      app = moduleRef.createNestApplication()

      const env = moduleRef.get(EnvService)

      contactFactory = app.get(FakeContactFactory)
      chatFactory = app.get(FakeChatFactory)
      messageFactory = app.get(FakeMessageFactory)

      const wwjsManager = app.get(WWJSClientManager)
      const wwjsService = app.get(WWJSClientService)

      const whatsAppFactory = app.get(FakeWhatsAppFactory)

      app.use(cookieParser)
      await app.init()

      const WWJS_TEST_CLIENT_ID = env.get('WWJS_TEST_CLIENT_ID')
      whatsApp = await whatsAppFactory.makePrismaWhatsApp(
        {},
        new UniqueEntityID(WWJS_TEST_CLIENT_ID),
      )

      wwjsClient = wwjsService.createFromWhatsApp(whatsApp)
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
    1000 * 60 * 1, // 1 minute
  )

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

  it('[EVENT] MESSAGE_ACK', async () => {
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

    const waMessage = await wwjsClient.message.sendText({
      chatId: helperWWJSClientWAId,
      body: '@test',
    })

    await messageFactory.makePrismaMessage({
      waMessageId: waMessage.id,
      type: 'text',
      ack: 'sent',
      whatsAppId: whatsApp.id,
      chatId: chat.id,
      waChatId: chat.waChatId,
      author: null,
      media: null,
      quoted: null,
      contacts: null,
      body: makeMessageBody({ content: waMessage.body! }),
    })

    return new Promise((resolve) => {
      socket.on('message:change', async () => {
        await Time.delay()

        resolve(true)
      })
    })
  })
})
