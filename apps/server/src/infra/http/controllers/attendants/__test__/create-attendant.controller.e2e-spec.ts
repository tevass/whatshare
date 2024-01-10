import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/http/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Create Attendant (HTTP)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  it('[POST] /attendants', async () => {
    const email = faker.internet.email()

    const response = await request(app.getHttpServer())
      .post('/attendants')
      .send({
        email,
        name: faker.person.firstName(),
        displayName: faker.internet.userName(),
        password: faker.string.hexadecimal(),
        whatsAppsIds: [],
      })

    expect(response.statusCode).toBe(201)

    const attendantOnDatabase = await prisma.attendant.findFirst({
      where: {
        profile: {
          email,
        },
      },
    })

    expect(attendantOnDatabase).toBeTruthy()
  })
})
