import { Module } from '@nestjs/common'
import { OtherGateway } from './other-wss.gateway'
import { WssGateway } from './wss.gateway'

@Module({
  providers: [WssGateway, OtherGateway],
})
export class WssModule {}
