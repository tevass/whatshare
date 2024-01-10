import { Module } from '@nestjs/common'

import { CryptographyModule } from './cryptography/cryptography.module'
import { DatabaseModule } from './http/database/database.module'
import { HttpModule } from './http/http.module'

@Module({
  imports: [DatabaseModule, CryptographyModule, HttpModule],
})
export class AppModule {}
