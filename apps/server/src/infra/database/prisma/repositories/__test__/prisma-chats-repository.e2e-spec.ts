import { FakeContactFactory } from '@/test/factories/make-contact'
import { FakeGroupChatFactory } from '@/test/factories/make-group-chat'
import {
  FakePrivateChatFactory,
  makePrivateChat,
} from '@/test/factories/make-private-chat'
import { makeWAEntityID } from '@/test/factories/make-wa-entity-id'
import { FakeWhatsAppFactory } from '@/test/factories/make-whats-app'
import { NestTestingApp } from '@/test/utils/nest-testing-app'
import { faker } from '@faker-js/faker'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { PrismaModule } from '../../prisma.module'
import { PrismaService } from '../../prisma.service'
import { PrismaChatsRepository } from '../prisma-chats-repository'

describe('PrismaChatsRepository', () => {
  let app: INestApplication
  let NEST_TESTING_APP: NestTestingApp

  let prisma: PrismaService
  let whatsAppFactory: FakeWhatsAppFactory
  let contactFactory: FakeContactFactory
  let privateChatFactory: FakePrivateChatFactory
  let chatsRepository: PrismaChatsRepository

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [
        PrismaChatsRepository,
        FakeWhatsAppFactory,
        FakeGroupChatFactory,
        FakePrivateChatFactory,
        FakeContactFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    NEST_TESTING_APP = new NestTestingApp(app)

    prisma = moduleRef.get(PrismaService)
    whatsAppFactory = moduleRef.get(FakeWhatsAppFactory)
    contactFactory = moduleRef.get(FakeContactFactory)
    privateChatFactory = moduleRef.get(FakePrivateChatFactory)
    chatsRepository = moduleRef.get(PrismaChatsRepository)

    await NEST_TESTING_APP.init()
  })

  beforeEach(async () => {
    await prisma.chat.deleteMany()
  })

  afterAll(async () => {
    await app.close()
  })

  test('create', async () => {
    const [whatsApp, contact] = await Promise.all([
      whatsAppFactory.makePrismaWhatsApp(),
      contactFactory.makePrismaContact(),
    ])

    const privateChat = makePrivateChat({
      whatsAppId: whatsApp.id,
      contact,
    })

    await chatsRepository.create(privateChat)

    const chatOnDatabase = await prisma.chat.findUnique({
      where: {
        id: privateChat.id.toString(),
      },
    })

    expect(chatOnDatabase).toBeTruthy()
    expect(chatOnDatabase?.isGroup).toBe(false)
  })

  test('createMany', async () => {
    const [whatsApps, contacts] = await Promise.all([
      Promise.all(
        Array.from(Array(2)).map(() => whatsAppFactory.makePrismaWhatsApp()),
      ),
      Promise.all(
        Array.from(Array(2)).map(() => contactFactory.makePrismaContact()),
      ),
    ])

    const chats = Array.from(Array(2)).map((_, i) =>
      makePrivateChat({ whatsAppId: whatsApps[i].id, contact: contacts[i] }),
    )

    await chatsRepository.createMany(chats)

    const chatsOnDatabase = await prisma.chat.findMany()
    expect(chatsOnDatabase).toHaveLength(2)
  })

  test('softDelete', async () => {
    const whatsApp = await whatsAppFactory.makePrismaWhatsApp()

    const privateChat = await privateChatFactory.makePrismaPrivateChat({
      whatsAppId: whatsApp.id,
    })

    await chatsRepository.softDelete(privateChat)

    const chatOnDatabase = await prisma.chat.findUniqueOrThrow({
      where: {
        id: privateChat.id.toString(),
      },
    })

    expect(chatOnDatabase).toEqual(
      expect.objectContaining({
        unreadCount: 0,
        deletedAt: expect.any(Date),
      }),
    )
  })

  test('save', async () => {
    const whatsApp = await whatsAppFactory.makePrismaWhatsApp()

    const privateChat = await privateChatFactory.makePrismaPrivateChat({
      whatsAppId: whatsApp.id,
    })

    const unreadCount = faker.number.int({ max: 99 })
    privateChat.set({ unreadCount })
    await chatsRepository.save(privateChat)

    const chatOnDatabase = await prisma.chat.findUniqueOrThrow({
      where: {
        id: privateChat.id.toString(),
      },
    })

    expect(chatOnDatabase).toEqual(
      expect.objectContaining({
        unreadCount,
      }),
    )
  })

  test('findManyByWhatsAppId', async () => {
    const whatsApp = await whatsAppFactory.makePrismaWhatsApp()

    await Promise.all(
      Array.from(Array(2))
        .map(() =>
          privateChatFactory.makePrismaPrivateChat({ whatsAppId: whatsApp.id }),
        )
        .concat(
          privateChatFactory.makePrismaPrivateChat({
            whatsAppId: whatsApp.id,
            deletedAt: new Date(),
          }),
        ),
    )

    const [allChats, activeChats] = await Promise.all([
      chatsRepository.findManyByWhatsAppId({
        page: 1,
        take: 5,
        whatsAppId: whatsApp.id.toString(),
      }),
      chatsRepository.findManyByWhatsAppId({
        page: 1,
        take: 5,
        whatsAppId: whatsApp.id.toString(),
        deleted: false,
      }),
    ])

    expect(allChats).toHaveLength(3)
    expect(activeChats).toHaveLength(2)
  })

  test('countManyByWhatsAppId', async () => {
    const whatsApp = await whatsAppFactory.makePrismaWhatsApp()

    const rowsLength = 2
    await Promise.all(
      Array.from(Array(rowsLength)).map(() =>
        privateChatFactory.makePrismaPrivateChat({ whatsAppId: whatsApp.id }),
      ),
    )

    const rows = await chatsRepository.countManyByWhatsAppId({
      whatsAppId: whatsApp.id.toString(),
    })

    expect(rows).toBe(rowsLength)
  })

  test('findByWAChatIdAndWhatsAppId', async () => {
    const waChatId = makeWAEntityID()
    const whatsApp = await whatsAppFactory.makePrismaWhatsApp()

    await privateChatFactory.makePrismaPrivateChat({
      whatsAppId: whatsApp.id,
      waChatId,
    })

    const chat = await chatsRepository.findByWAChatIdAndWhatsAppId({
      waChatId,
      whatsAppId: whatsApp.id.toString(),
    })

    expect(chat).toBeTruthy()
    expect(chat?.contact).toBeTruthy()
    expect(chat?.lastMessage).toBe(null)
  })

  test('findManyByWAChatsIds', async () => {
    const waChatsIds = Array.from(Array(2)).map(() => makeWAEntityID())
    const whatsApp = await whatsAppFactory.makePrismaWhatsApp()

    await Promise.all(
      waChatsIds.map((waChatId) =>
        privateChatFactory.makePrismaPrivateChat({
          whatsAppId: whatsApp.id,
          waChatId,
        }),
      ),
    )

    const chats = await chatsRepository.findManyByWAChatsIds({
      waChatsIds,
    })

    expect(chats).toHaveLength(2)
  })
})
