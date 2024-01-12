import { Module } from '@nestjs/common'

import { AuthenticateAttendantUseCase } from '@/domain/chat/application/use-cases/attendants/authenticate-attendant-use-case'
import { AuthenticateController } from './authenticate.controller'

@Module({
  controllers: [AuthenticateController],
  providers: [AuthenticateAttendantUseCase],
})
export class SessionsModule {}
