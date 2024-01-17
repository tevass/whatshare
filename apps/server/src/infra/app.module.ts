import { Module } from '@nestjs/common'

import { EnvModule } from './env/env.module'
import { HttpModule } from './http/http.module'
import { DatabaseModule } from './database/database.module'
import { AuthModule } from './auth/auth.module'
import { ServicesModule } from './services/services.module'

@Module({
  imports: [EnvModule, DatabaseModule, ServicesModule, AuthModule, HttpModule],
})
export class AppModule {}