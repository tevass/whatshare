import type { Server, Socket } from 'socket.io'

export type WSMiddlewareNext = Parameters<Parameters<Server['use']>[0]>[1]

export interface WSMiddleware {
  execute(socket: Socket, next: WSMiddlewareNext): void
}
