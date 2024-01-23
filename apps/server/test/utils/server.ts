import { INestApplication } from '@nestjs/common'

export class Server {
  static getAddressFromApp(app: INestApplication) {
    const { port } = app.getHttpServer().listen().address()
    return `http://localhost:${port}`
  }
}
