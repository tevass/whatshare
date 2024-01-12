import { Injectable } from '@nestjs/common'
import { CONSTANTS, Constants } from './constants'

@Injectable()
export class ConstantsService {
  get<T extends keyof Constants>(key: T) {
    return CONSTANTS[key]
  }
}
