import { Global, Module } from '@nestjs/common'
import { WWJSModule } from './wwjs/wwjs.module'

@Global()
@Module({
  imports: [WWJSModule],
  exports: [WWJSModule],
})
export class ServicesModule {}
