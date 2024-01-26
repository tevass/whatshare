import { applyDecorators } from '@nestjs/common'
import { SubscribeMessage } from '@nestjs/websockets'

export function WsSubscribeEvent<Event>(event: keyof Event) {
  return applyDecorators(SubscribeMessage(event))
}
