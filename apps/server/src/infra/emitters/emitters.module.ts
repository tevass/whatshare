import { Module } from '@nestjs/common'
import { WsModule } from './ws/ws.module'

@Module({
  imports: [WsModule],
  exports: [WsModule],
})
export class EmittersModule {}
