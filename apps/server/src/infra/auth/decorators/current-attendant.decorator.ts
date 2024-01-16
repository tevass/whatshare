import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { AttendantPayload } from '../payload-schema'

export const CurrentAttendant = createParamDecorator(
  (data: keyof AttendantPayload, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest()
    const user = request.user as AttendantPayload

    return data ? user[data] : user
  },
)
