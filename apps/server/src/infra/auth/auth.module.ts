import { Global, Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

import { EnvService } from '../env/env.service'

import { JwtStrategy } from './strategies/jwt.strategy'
import { RefreshJwtStrategy } from './strategies/refresh-jwt.strategy'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { EnvModule } from '../env/env.module'

@Global()
@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [EnvModule],
      inject: [EnvService],
      global: true,
      useFactory(env: EnvService) {
        const JWT_SECRET = env.get('JWT_SECRET')

        return {
          secret: JWT_SECRET,
        }
      },
    }),
  ],
  providers: [
    EnvService,
    JwtStrategy,
    RefreshJwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AuthModule {}
