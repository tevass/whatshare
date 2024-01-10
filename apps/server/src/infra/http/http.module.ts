import { Module } from '@nestjs/common'

import { AttendantsModule } from './controllers/attendants/attendants.module'

@Module({
  imports: [AttendantsModule],
})
export class HttpModule {}
