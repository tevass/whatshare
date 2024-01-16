import { Module } from '@nestjs/common'

import { AdaptersModule } from '@/infra/adapters/adapters.module'
import { CryptographyModule } from '@/infra/cryptography/cryptography.module'

import { AuthenticateController } from './authenticate.controller'
import { RefreshAuthenticationController } from './refresh-authentication.controller'

import { AuthenticateAttendantUseCase } from '@/domain/chat/application/use-cases/attendants/authenticate-attendant-use-case'
import { RefreshAuthenticatedAttendantUseCase } from '@/domain/chat/application/use-cases/attendants/refresh-authenticated-attendant-use-case'

@Module({
  imports: [CryptographyModule, AdaptersModule],
  controllers: [AuthenticateController, RefreshAuthenticationController],
  providers: [
    AuthenticateAttendantUseCase,
    RefreshAuthenticatedAttendantUseCase,
  ],
})
export class SessionsModule {}
