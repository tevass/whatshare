import { Module } from '@nestjs/common'

import { CreateAttendantUseCase } from '@/domain/chat/application/use-cases/attendants/create-attendant-use-case'
import { CreateAttendantController } from './create-attendant.controller'
import { CryptographyModule } from '@/infra/cryptography/cryptography.module'

@Module({
  imports: [CryptographyModule],
  controllers: [CreateAttendantController],
  providers: [CreateAttendantUseCase],
})
export class AttendantsModule {}
