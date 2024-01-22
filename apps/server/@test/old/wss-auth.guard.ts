import { tokenPayloadSchema } from '@/infra/auth/payload-schema'
import { EnvService } from '@/infra/env/env.service'
import { ExecutionContext, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AuthGuard } from '@nestjs/passport'
import { WsException } from '@nestjs/websockets'
import { Socket } from 'socket.io'

@Injectable()
export class WssAuthGuard extends AuthGuard('wss') {
  constructor(
    private jwt: JwtService,
    private env: EnvService,
  ) {
    super()
  }

  canActivate(context: ExecutionContext) {
    const client = context.switchToWs().getClient() as Socket

    const cookies: string[] = client.handshake.headers.cookie?.split('; ') ?? []

    const JWT_COOKIE_NAME = this.env.get('JWT_COOKIE_NAME')

    const token = cookies
      .find((cookie) => cookie.startsWith(JWT_COOKIE_NAME))
      ?.split('=')[1]

    if (!token) throw new WsException('Invalid credentials.')

    try {
      const payload = this.jwt.verify(token, {
        ignoreExpiration: true,
      })

      const user = tokenPayloadSchema.safeParse(payload)
      if (!user.success) throw new WsException('Invalid credentials.')

      const data = context.switchToWs().getData()
      if (data) data.user = user.data

      return true
    } catch (error) {
      throw new WsException('Invalid credentials.')
    }
  }
}
