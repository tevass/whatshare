import { HashGenerator } from '@/domain/chat/application/cryptography/hash-generator'
import { Injectable } from '@nestjs/common'
import { hash } from 'bcryptjs'

@Injectable()
export class Bcrypt implements HashGenerator {
  private HASH_SALT_LENGTH = 8

  hash(plain: string): Promise<string> {
    return hash(plain, this.HASH_SALT_LENGTH)
  }
}
