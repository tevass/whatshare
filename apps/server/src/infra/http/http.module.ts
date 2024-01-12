import { Module } from '@nestjs/common'

import { AttendantsModule } from './controllers/attendants/attendants.module'
import { SessionsModule } from './controllers/sessions/sessions.module'

@Module({
  imports: [AttendantsModule, SessionsModule],
})
export class HttpModule {}
