import { Injectable } from '@nestjs/common'
import type { Socket } from 'socket.io'

interface Event {
  name: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listener: (...args: any[]) => Promise<void> | void
}

@Injectable()
export class WssService {
  private readonly sockets: Map<string, Socket> = new Map()

  private events: Event[] = []

  handleConnection(socket: Socket): void {
    const clientId = socket.id
    this.sockets.set(clientId, socket)

    socket.use((event, next) => {})

    this.events.forEach((event) => {
      socket.on(event.name, event.listener)
    })

    socket.on('disconnect', () => {
      this.sockets.delete(clientId)
    })
  }

  addEvent(event: Event) {
    this.events.push(event)
  }
}
