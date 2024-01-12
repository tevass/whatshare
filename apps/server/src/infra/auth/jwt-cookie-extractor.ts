import { Injectable } from '@nestjs/common'
import { Request } from 'express'
import { ConstantsService } from '../constants/constants.service'

interface ExtractProps {
  req: Request
  cookieName: string
}

@Injectable()
export class JwtCookieExtractor {
  constructor(private constants: ConstantsService) {}

  private extract({ cookieName, req }: ExtractProps) {
    const hasCookies = !!req.cookies
    const cookie = req.cookies[cookieName]

    if (hasCookies && cookie) {
      return cookie as string
    }

    return null
  }

  extractAccessToken(req: Request) {
    const { jwt } = this.constants.get('auth')

    const cookieName = jwt.cookies.access_token

    return this.extract({
      req,
      cookieName,
    })
  }

  extractRefreshToken(req: Request) {
    const { jwt } = this.constants.get('auth')

    const cookieName = jwt.cookies.refresh_token

    return this.extract({
      req,
      cookieName,
    })
  }
}
