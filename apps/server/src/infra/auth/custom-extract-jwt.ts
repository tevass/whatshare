import { Request } from 'express'
import { JwtFromRequestFunction } from 'passport-jwt'
import { Socket } from 'socket.io'

export class CustomExtractJwt {
  static fromCookie(name: string): JwtFromRequestFunction<Request> {
    return (req) => {
      const hasCookies = !!req.cookies

      return hasCookies ? (req.cookies[name] as string) : null
    }
  }

  static fromWsCookie(
    name: string,
  ): JwtFromRequestFunction<Socket['handshake']> {
    return (handshake) => {
      const cookies = handshake.headers.cookie?.split('; ') ?? []
      const hasCookies = !!cookies.length

      if (!hasCookies) return null

      const token = cookies
        .find((cookie) => cookie.startsWith(name))
        ?.split('=')[1]

      return token ?? null
    }
  }
}
