import { AppModule } from '@/infra/app.module'
import { EnvService } from '@/infra/env/env.service'
import { FakeAttendantFactory } from '@/test/factories/make-attendant'
import { FakeAttendantProfileFactory } from '@/test/factories/make-attendant-profile'
import { NestTestingApp } from '@/test/utils/nest-testing-app'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import supertest from 'supertest'

describe('Refresh Authentication', () => {
  let app: INestApplication
  let NEST_TESTING_APP: NestTestingApp

  let attendantFactory: FakeAttendantFactory
  let env: EnvService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [FakeAttendantFactory, FakeAttendantProfileFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    NEST_TESTING_APP = new NestTestingApp(app)

    env = moduleRef.get(EnvService)
    attendantFactory = moduleRef.get(FakeAttendantFactory)

    await NEST_TESTING_APP.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('[PATCH] /sessions/refresh', async () => {
    const attendant = await attendantFactory.makePrismaAttendant()

    const refreshToken = NEST_TESTING_APP.authenticate({
      sub: attendant.id.toString(),
    })
    const JWT_REFRESH_COOKIE_NAME = env.get('JWT_REFRESH_COOKIE_NAME')

    const response = await supertest(app.getHttpServer())
      .patch('/sessions/refresh')
      .set('Cookie', `${JWT_REFRESH_COOKIE_NAME}=${refreshToken}`)
      .send()

    expect(response.statusCode).toBe(200)

    const cookies = response.headers['set-cookie']
    const JWT_COOKIE_NAME = env.get('JWT_COOKIE_NAME')

    expect(cookies).toHaveLength(2)
    expect(cookies).toEqual(
      expect.arrayContaining([
        expect.stringContaining(JWT_COOKIE_NAME),
        expect.stringContaining(JWT_REFRESH_COOKIE_NAME),
      ]),
    )
  })
})
