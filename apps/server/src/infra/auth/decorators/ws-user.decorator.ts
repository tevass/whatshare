import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { AttendantPayload } from '../payload-schema'

export const WsUser = createParamDecorator(
  (data: keyof AttendantPayload, context: ExecutionContext) => {
    const socket = context.switchToWs().getClient()
    const user = socket.handshake.user as AttendantPayload

    return data ? user[data] : user
  },
)
