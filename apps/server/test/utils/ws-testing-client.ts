import { io, Socket } from 'socket.io-client'

interface CreateWsTestingClient {
  address: string
  cookie: string
  room: string
}

export class WsTestingClient {
  static waAddress(baseAddress: string) {
    return baseAddress.concat('/wa')
  }

  static create({ address, cookie, room }: CreateWsTestingClient): Socket {
    return io(address, {
      extraHeaders: {
        cookie,
      },
      query: {
        room,
      },
    })
  }
}
