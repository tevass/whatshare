import { ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class WssAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super()
  }

  getRequest(context: ExecutionContext) {
    return context.switchToWs().getClient().handshake
  }

  // canActivate(
  //   context: ExecutionContext,
  // ): boolean | Promise<boolean> | Observable<boolean> {
  //   const client = context.switchToWs().getClient() as Socket
  // }
}
