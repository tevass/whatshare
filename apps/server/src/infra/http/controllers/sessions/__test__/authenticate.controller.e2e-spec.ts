import { HashGenerator } from '@/domain/chat/application/cryptography/hash-generator'
import { AppModule } from '@/infra/app.module'
import { EnvService } from '@/infra/env/env.service'
import { FakeAttendant } from '@/test/factories/make-attendant'
import { FakeAttendantProfile } from '@/test/factories/make-attendant-profile'
import { faker } from '@faker-js/faker'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import cookieParser from 'cookie-parser'
import supertest from 'supertest'

describe('Authenticate', () => {
  let app: INestApplication
  let attendantFactory: FakeAttendant
  let hasher: HashGenerator
  let env: EnvService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [FakeAttendant, FakeAttendantProfile],
    }).compile()

    app = moduleRef.createNestApplication()
    attendantFactory = app.get(FakeAttendant)
    hasher = app.get(HashGenerator)
    env = app.get(EnvService)

    app.use(cookieParser())

    await app.init()
  })

  it('[POST] /sessions', async () => {
    const password = faker.string.hexadecimal()

    const attendant = await attendantFactory.makePrismaAttendant({
      password: await hasher.hash(password),
    })

    const response = await supertest(app.getHttpServer())
      .post('/sessions')
      .send({
        email: attendant.profile.email,
        password,
      })

    expect(response.statusCode).toBe(200)

    const cookies = response.headers['set-cookie']
    const JWT_COOKIE_NAME = env.get('JWT_COOKIE_NAME')
    const JWT_REFRESH_COOKIE_NAME = env.get('JWT_REFRESH_COOKIE_NAME')

    expect(cookies).toHaveLength(2)
    expect(cookies).toEqual(
      expect.arrayContaining([
        expect.stringContaining(JWT_COOKIE_NAME),
        expect.stringContaining(JWT_REFRESH_COOKIE_NAME),
      ]),
    )
  })
})
