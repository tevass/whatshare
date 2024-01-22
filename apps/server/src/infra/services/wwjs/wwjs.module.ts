import { WAServiceManager } from '@/domain/chat/application/services/wa-service-manager'
import { EmittersModule } from '@/infra/emitters/emitters.module'
import { Logger, Module } from '@nestjs/common'
import { WWJSService } from './wwjs.service'

@Module({
  imports: [EmittersModule],
  providers: [
    Logger,
    WWJSService,
    {
      provide: WAServiceManager,
      useExisting: WWJSService,
    },
  ],
  exports: [WAServiceManager],
})
export class WWJSModule {}
