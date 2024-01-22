import { Global, Module } from '@nestjs/common'
import { WAWebJSModule } from './wa-web-js/wa-web-js.module'

@Global()
@Module({
  imports: [WAWebJSModule],
})
export class ServicesModule {}
