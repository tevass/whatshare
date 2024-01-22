import { UseGuards, applyDecorators } from '@nestjs/common'
import { WsNamespaceGateway } from './ws-namespace-gateway.decorator'
import { WsJwtAuthGuard } from '@/infra/auth/guards/ws-jwt.guard'

export const WsNamespaceWAGateway = () =>
  applyDecorators(
    WsNamespaceGateway({ namespace: 'wa' }),
    UseGuards(WsJwtAuthGuard),
  )
