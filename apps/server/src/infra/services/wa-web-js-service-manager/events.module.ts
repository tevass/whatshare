import { Module, forwardRef } from '@nestjs/common'
import { WAWebJSModule } from './wa-web-js.module'

import { WAHandleGenerateQrCodeEvent } from './events/wa-handle-generate-qr-code-event'

@Module({
  imports: [forwardRef(() => WAWebJSModule)],
  providers: [WAHandleGenerateQrCodeEvent],
})
export class WAWebJSEventsModule {}
