import { Uploader } from '@/domain/chat/application/storage/uploader'
import { Module } from '@nestjs/common'
import { R2Storage } from './r2-storage'

@Module({
  providers: [
    {
      provide: Uploader,
      useClass: R2Storage,
    },
  ],
  exports: [Uploader],
})
export class StorageModule {}
