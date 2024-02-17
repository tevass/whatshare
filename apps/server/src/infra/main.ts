import { NestFactory } from '@nestjs/core'
import cookieParser from 'cookie-parser'

import { AppModule } from './app.module'
import { EnvService } from './env/env.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors({
    origin: true,
    credentials: true,
  })

  app.setGlobalPrefix('/v1')
  app.use(cookieParser())

  const envService = app.get<EnvService>(EnvService)
  const port = envService.get('PORT')

  await app.listen(port)
}
bootstrap()
