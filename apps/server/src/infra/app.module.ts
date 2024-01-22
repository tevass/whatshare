import { Module } from '@nestjs/common'

import { AuthModule } from './auth/auth.module'
import { DatabaseModule } from './database/database.module'
import { EmittersModule } from './emitters/emitters.module'
import { EnvModule } from './env/env.module'
import { HttpModule } from './http/http.module'
import { ServicesModule } from './services/services.module'

@Module({
  imports: [
    EnvModule,
    DatabaseModule,
    ServicesModule,
    AuthModule,
    HttpModule,
    EmittersModule,
  ],
})
export class AppModule {}
