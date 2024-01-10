import { Module } from '@nestjs/common'

import { CreateAttendantUseCase } from '@/domain/chat/application/use-cases/attendants/create-attendant-use-case'
import { CreateAttendantController } from './create-attendant.controller'

@Module({
  controllers: [CreateAttendantController],
  providers: [CreateAttendantUseCase],
})
export class AttendantsModule {}
