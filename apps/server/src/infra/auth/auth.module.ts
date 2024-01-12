import { Global, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { ConstantsService } from '../constants/constants.service'
import { EnvModule } from '../env/env.module'
import { EnvService } from '../env/env.service'
import { JwtAuthGuard } from './jwt-auth.guard'
import { JwtCookieExtractor } from './jwt-cookie-extractor'
import { JwtStrategy } from './jwt.strategy'
import { RefreshStrategy } from './refresh.strategy'

@Global()
@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [EnvModule],
      inject: [ConfigService],
      global: true,
      useFactory(config: EnvService) {
        const JWT_SECRET = config.get('JWT_SECRET')

        return {
          secret: JWT_SECRET,
        }
      },
    }),
  ],
  providers: [
    ConstantsService,
    EnvService,
    JwtCookieExtractor,
    JwtStrategy,
    RefreshStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AuthModule {}
