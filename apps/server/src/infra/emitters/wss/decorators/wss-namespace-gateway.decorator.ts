import { applyDecorators } from '@nestjs/common'
import { GatewayMetadata, WebSocketGateway } from '@nestjs/websockets'
import type { WssNamespace } from '@whatshare/wss-schemas/namespace'

interface WssNamespaceGatewayOptions extends GatewayMetadata {
  namespace: WssNamespace
}

export const WssNamespaceGateway = (opts: WssNamespaceGatewayOptions) =>
  applyDecorators(WebSocketGateway(opts))
