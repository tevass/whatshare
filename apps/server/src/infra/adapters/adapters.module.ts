import { DateAdapter } from '@/domain/chat/application/adapters/date-adapter'
import { Module } from '@nestjs/common'
import { DayjsAdapter } from './dayjs-adapter'

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
