import { Module } from '@nestjs/common'
import { WssModule } from './wss/wss.module'

@Module({
  imports: [WssModule],
  exports: [WssModule],
})
export class EmittersModule {}
