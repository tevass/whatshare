import { EnvService } from '@/infra/env/env.service'
import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { AttendantPayload, tokenPayloadSchema } from '../payload-schema'
import { CustomExtractJwt } from '../custom-extract-jwt'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(env: EnvService) {
    const JWT_SECRET = env.get('JWT_SECRET')
    const JWT_COOKIE_NAME = env.get('JWT_COOKIE_NAME')

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        CustomExtractJwt.fromCookie(JWT_COOKIE_NAME),
      ]),
      secretOrKey: JWT_SECRET,
    })
  }

  async validate(payload: AttendantPayload) {
    return tokenPayloadSchema.parse(payload)
  }
}
