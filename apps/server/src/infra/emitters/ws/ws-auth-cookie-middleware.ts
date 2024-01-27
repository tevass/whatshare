import { CustomExtractJwt } from '@/infra/auth/custom-extract-jwt'
import { EnvService } from '@/infra/env/env.service'
import { Injectable } from '@nestjs/common'
import { WsException } from '@nestjs/websockets'
import type { Socket } from 'socket.io'
import { WSMiddleware, WSMiddlewareNext } from './ws-middleware'

@Injectable()
export class WSAuthCookieMiddleware implements WSMiddleware {
  constructor(private env: EnvService) {}

  execute(socket: Socket, next: WSMiddlewareNext) {
    const JWT_COOKIE_NAME = this.env.get('JWT_COOKIE_NAME')
    const extractCookie = CustomExtractJwt.fromWsCookie(JWT_COOKIE_NAME)

    const value = extractCookie(socket.handshake)

    if (!value) {
      return next(
        new WsException({
          message: 'Invalid cookie',
        }),
      )
    }

    next()
  }
}
