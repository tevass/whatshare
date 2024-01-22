import { applyDecorators } from '@nestjs/common'
import { WebSocketGateway, GatewayMetadata } from '@nestjs/websockets'

import { WsNamespace } from '@whatshare/ws-schemas/namespace'

interface WsNamespaceGatewayMetadata extends GatewayMetadata {
  namespace: WsNamespace
}

export const WsNamespaceGateway = (opts: WsNamespaceGatewayMetadata) =>
  applyDecorators(WebSocketGateway(opts))
