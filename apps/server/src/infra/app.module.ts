import { Module } from '@nestjs/common'

import { EnvModule } from './env/env.module'
import { HttpModule } from './http/http.module'
import { DatabaseModule } from './database/database.module'
import { AuthModule } from './auth/auth.module'

@Module({
  imports: [EnvModule, DatabaseModule, AuthModule, HttpModule],
})
export class AppModule {}
