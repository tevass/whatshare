import { FakeContactFactory } from '@/test/factories/make-contact'
import {
  FakeMessageMediaFactory,
  makeMessageMedia,
} from '@/test/factories/make-message-media'
import { FakePrivateChatFactory } from '@/test/factories/make-private-chat'
import { FakePrivateMessageFactory } from '@/test/factories/make-private-message'
import { makeUniqueEntityID } from '@/test/factories/make-unique-entity-id'
import { FakeWhatsAppFactory } from '@/test/factories/make-whats-app'
import { NestTestingApp } from '@/test/utils/nest-testing-app'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { PrismaModule } from '../../prisma.module'
import { PrismaService } from '../../prisma.service'
import { PrismaMessageMediasRepository } from '../prisma-message-medias-repository'

describe('PrismaMessageMediasRepository', () => {
  let app: INestApplication
  let NEST_TESTING_APP: NestTestingApp

  let prisma: PrismaService
  let messageMediaFactory: FakeMessageMediaFactory
  let messageMediasRepository: PrismaMessageMediasRepository

  let whatsAppFactory: FakeWhatsAppFactory
  let privateChatFactory: FakePrivateChatFactory
  let privateMessageFactory: FakePrivateMessageFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [
        PrismaMessageMediasRepository,
        FakeMessageMediaFactory,
        FakeWhatsAppFactory,
        FakePrivateChatFactory,
        FakeContactFactory,
        FakePrivateMessageFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    NEST_TESTING_APP = new NestTestingApp(app)

    prisma = moduleRef.get(PrismaService)
    messageMediaFactory = moduleRef.get(FakeMessageMediaFactory)
    messageMediasRepository = moduleRef.get(PrismaMessageMediasRepository)

    whatsAppFactory = moduleRef.get(FakeWhatsAppFactory)
    privateChatFactory = moduleRef.get(FakePrivateChatFactory)
    privateMessageFactory = moduleRef.get(FakePrivateMessageFactory)

    await NEST_TESTING_APP.init()
  })

  beforeEach(async () => {
    await prisma.media.deleteMany()
  })

  afterAll(async () => {
    await app.close()
  })

  test('create', async () => {
    const media = makeMessageMedia({ messageId: null })

    await messageMediasRepository.create(media)
    const mediaOnDatabase = await prisma.media.findUnique({
      where: {
        id: media.id.toString(),
      },
    })

    expect(mediaOnDatabase).toBeTruthy()
  })

  test('delete', async () => {
    const media = await messageMediaFactory.makePrismaMessageMedia()

    await messageMediasRepository.delete(media)
    const mediasOnDatabase = await prisma.media.findMany()

    expect(mediasOnDatabase).toHaveLength(0)
  })

  test('deleteMany', async () => {
    const rowsLength = 2

    const medias = await Promise.all(
      Array.from(Array(rowsLength)).map(() =>
        messageMediaFactory.makePrismaMessageMedia(),
      ),
    )

    await messageMediasRepository.deleteMany(medias)
    const mediasOnDatabase = await prisma.media.findMany()

    expect(mediasOnDatabase).toHaveLength(0)
  })

  test('findManyByMessagesIds', async () => {
    const rowsLength = 2

    const whatsApp = await whatsAppFactory.makePrismaWhatsApp()
    const privateChat = await privateChatFactory.makePrismaPrivateChat({
      whatsAppId: whatsApp.id,
    })

    const messagesIds = Array.from(Array(rowsLength)).map(() =>
      makeUniqueEntityID(),
    )

    await Promise.all(
      messagesIds.map(() =>
        privateMessageFactory.makePrismaPrivateMessage({
          chatId: privateChat.id,
          waChatId: privateChat.waChatId,
          whatsAppId: whatsApp.id,
        }),
      ),
    )

    await Promise.all(
      messagesIds.map((messageId) =>
        messageMediaFactory.makePrismaMessageMedia({
          messageId,
        }),
      ),
    )

    const medias = await messageMediasRepository.findManyByMessagesIds({
      messagesIds: messagesIds.map((id) => id.toString()),
    })

    expect(medias).toHaveLength(rowsLength)
  })
})
