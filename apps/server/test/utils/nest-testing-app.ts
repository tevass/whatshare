import { EnvService } from '@/infra/env/env.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import cookieParser from 'cookie-parser'

export class NestTestingApp {
  constructor(private app: INestApplication) {}

  private useDefaults() {
    this.app.use(cookieParser())
  }

  async init() {
    this.useDefaults()
    await this.app.init()
  }

  getAddress(app: INestApplication) {
    const { port } = app.getHttpServer().listen().address()
    return `http://localhost:${port}`
  }

  authenticate<Payload extends Record<string, unknown>>(payload: Payload) {
    const jwt = this.app.get(JwtService)
    return jwt.sign(payload)
  }

  getAuthCookie(value: string) {
    const env = this.app.get(EnvService)
    const JWT_COOKIE_NAME = env.get('JWT_COOKIE_NAME')

    return `${JWT_COOKIE_NAME}=${value}`
  }
}
