import { FakeContactFactory, makeContact } from '@/test/factories/make-contact'
import { makeUniqueEntityID } from '@/test/factories/make-unique-entity-id'
import { makeWAEntityID } from '@/test/factories/make-wa-entity-id'
import { makeContactPhone } from '@/test/factories/value-objects/make-contact-phone'
import { NestTestingApp } from '@/test/utils/nest-testing-app'
import { faker } from '@faker-js/faker'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { PrismaModule } from '../../prisma.module'
import { PrismaService } from '../../prisma.service'
import { PrismaContactsRepository } from '../prisma-contacts-repository'

describe('PrismaContactsRepository', () => {
  let app: INestApplication
  let NEST_TESTING_APP: NestTestingApp

  let prisma: PrismaService
  let contactFactory: FakeContactFactory
  let contactsRepository: PrismaContactsRepository

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [PrismaContactsRepository, FakeContactFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    NEST_TESTING_APP = new NestTestingApp(app)

    prisma = moduleRef.get(PrismaService)
    contactFactory = moduleRef.get(FakeContactFactory)
    contactsRepository = moduleRef.get(PrismaContactsRepository)

    await NEST_TESTING_APP.init()
  })

  beforeEach(async () => {
    await prisma.contact.deleteMany()
  })

  afterAll(async () => {
    await app.close()
  })

  test('create', async () => {
    const contact = makeContact()

    await contactsRepository.create(contact)

    const contactOnDatabase = await prisma.contact.findUnique({
      where: {
        id: contact.id.toString(),
      },
    })

    expect(contactOnDatabase).toBeTruthy()
  })

  test('createMany', async () => {
    const rowsLength = 2
    const contacts = Array.from(Array(rowsLength)).map(() => makeContact())

    await contactsRepository.createMany(contacts)

    const contactsOnDatabase = await prisma.contact.findMany()
    expect(contactsOnDatabase).toHaveLength(rowsLength)
  })

  test('save', async () => {
    const contact = await contactFactory.makePrismaContact()

    const name = faker.person.firstName()
    contact.set({ name })

    await contactsRepository.save(contact)
    const contactOnDatabase = await prisma.contact.findUnique({
      where: {
        id: contact.id.toString(),
      },
    })

    expect(contactOnDatabase).toEqual(
      expect.objectContaining({
        name,
      }),
    )
  })

  test('saveMany', async () => {
    const contacts = await Promise.all(
      Array.from(Array(2)).map(() => contactFactory.makePrismaContact()),
    )

    const names = Array.from(Array(2)).map(() => faker.person.firstName())
    names.forEach((name, i) => contacts[i].set({ name }))

    await contactsRepository.saveMany(contacts)
    const contactsOnDatabase = await prisma.contact.findMany()

    expect(contactsOnDatabase).toEqual(
      expect.arrayContaining(
        names.map((name) =>
          expect.objectContaining({
            name,
          }),
        ),
      ),
    )
  })

  test('countMany', async () => {
    const rowsLength = 2
    await Promise.all(
      Array.from(Array(rowsLength)).map(() =>
        contactFactory.makePrismaContact(),
      ),
    )

    const rows = await contactsRepository.countMany({})

    expect(rows).toBe(rowsLength)
  })

  test('findMany', async () => {
    const rowsLength = 2

    await Promise.all(
      Array.from(Array(rowsLength)).map(() =>
        contactFactory.makePrismaContact(),
      ),
    )

    const contacts = await contactsRepository.findMany({
      page: 1,
      take: 5,
    })

    expect(contacts).toHaveLength(rowsLength)
  })

  test('findManyByWAContactsIds', async () => {
    const rowsLength = 2
    const waContactsIds = Array.from(Array(rowsLength)).map(() =>
      makeWAEntityID(),
    )

    await Promise.all(
      waContactsIds.map((waContactId) =>
        contactFactory.makePrismaContact({ waContactId }),
      ),
    )

    const contacts = await contactsRepository.findManyByWAContactsIds({
      waContactsIds,
    })

    expect(contacts).toHaveLength(rowsLength)
  })

  test('findByWAContactId', async () => {
    const waContactId = makeWAEntityID()

    await contactFactory.makePrismaContact({ waContactId })
    const contact = await contactsRepository.findByWAContactId({
      waContactId,
    })

    expect(contact).toBeTruthy()
  })

  test('findByPhone', async () => {
    const phone = makeContactPhone()

    await contactFactory.makePrismaContact({ phone })
    const contact = await contactsRepository.findByPhone({
      phone: phone.number,
    })

    expect(contact).toBeTruthy()
  })

  test('findById', async () => {
    const contactId = makeUniqueEntityID()

    await contactFactory.makePrismaContact({}, contactId)
    const contact = await contactsRepository.findById({
      id: contactId.toString(),
    })

    expect(contact).toBeTruthy()
  })
})
