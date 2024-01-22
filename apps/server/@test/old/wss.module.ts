import { Module } from '@nestjs/common'
import { HandleTest } from './handle-test'
import { WssGateway } from './wss.gateway'
import { WssService } from './wss.service'

@Module({
  providers: [WssGateway, WssService, HandleTest],
})
export class WssModule {}
