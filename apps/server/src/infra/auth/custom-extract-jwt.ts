import { Request } from 'express'
import { JwtFromRequestFunction } from 'passport-jwt'

export class CustomExtractJwt {
  static fromCookie(name: string): JwtFromRequestFunction<Request> {
    return (req) => {
      const hasCookies = !!req.cookies
      const cookie = req.cookies[name]

      if (hasCookies && cookie) {
        return cookie as string
      }

      return null
    }
  }
}
