import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { IS_PUBLIC_KEY } from '../decorators/public.decorator'
import { Socket } from 'socket.io'

@Injectable()
export class WsJwtAuthGuard extends AuthGuard('ws-jwt') implements CanActivate {
  constructor(private reflector: Reflector) {
    super()
  }

  getRequest(context: ExecutionContext) {
    const socket = context.switchToWs().getClient() as Socket
    return socket.handshake
  }

  canActivate(
    context: ExecutionContext,
  ): ReturnType<CanActivate['canActivate']> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) {
      return true
    }

    return super.canActivate(context)
  }
}
