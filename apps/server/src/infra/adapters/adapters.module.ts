import { DateAdapter } from '@/domain/chat/application/adapters/date-adapter'
import { Global, Module } from '@nestjs/common'
import { DayjsAdapter } from './dayjs-adapter'

@Global()
@Module({
  providers: [
    {
      provide: DateAdapter,
      useClass: DayjsAdapter,
    },
  ],
  exports: [DateAdapter],
})
export class AdaptersModule {}
