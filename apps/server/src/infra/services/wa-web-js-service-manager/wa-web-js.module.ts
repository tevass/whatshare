import { WAServiceManager } from '@/domain/chat/application/services/wa-service-manager'
import { Logger, Module, forwardRef } from '@nestjs/common'
import { WAWebJSServiceManager } from './wa-web-js-manager.service'
import { WAWebJSEventsModule } from './events.module'

@Module({
  imports: [forwardRef(() => WAWebJSEventsModule)],
  providers: [
    Logger,
    WAWebJSServiceManager,
    {
      provide: WAServiceManager,
      useExisting: WAWebJSServiceManager,
    },
  ],
  exports: [WAServiceManager, WAWebJSServiceManager],
})
export class WAWebJSModule {}
