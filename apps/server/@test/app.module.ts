import { AuthModule } from '@/infra/auth/auth.module'
import { EnvModule } from '@/infra/env/env.module'
import { Module } from '@nestjs/common'
import { WssModule } from './wss.module'

@Module({
  imports: [EnvModule, AuthModule, WssModule],
})
export class AppModule {}
