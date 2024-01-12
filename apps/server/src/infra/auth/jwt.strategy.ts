import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { EnvService } from '../env/env.service'
import { JwtCookieExtractor } from './jwt-cookie-extractor'
import { UserPayload, tokenPayloadSchema } from './payload'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: EnvService, extractor: JwtCookieExtractor) {
    const JWT_SECRET = config.get('JWT_SECRET')

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        extractor.extractAccessToken.bind(extractor),
      ]),
      secretOrKey: JWT_SECRET,
    })
  }

  async validate(payload: UserPayload) {
    return tokenPayloadSchema.parse(payload)
  }
}
