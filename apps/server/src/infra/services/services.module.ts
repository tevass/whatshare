import { Global, Module } from '@nestjs/common'
import { WWJSModule } from './wwjs/wwjs.module'

@Global()
@Module({
  imports: [WWJSModule],
})
export class ServicesModule {}
