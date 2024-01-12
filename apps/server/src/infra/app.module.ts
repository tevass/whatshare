import { Module } from '@nestjs/common'

import { AdaptersModule } from './adapters/adapters.module'
import { AuthModule } from './auth/auth.module'
import { ConstantsModule } from './constants/constants.module'
import { CryptographyModule } from './cryptography/cryptography.module'
import { DatabaseModule } from './database/database.module'
import { EnvModule } from './env/env.module'
import { HttpModule } from './http/http.module'

@Module({
  imports: [
    ConstantsModule,
    EnvModule,
    AuthModule,
    DatabaseModule,
    CryptographyModule,
    AdaptersModule,
    HttpModule,
  ],
})
export class AppModule {}
