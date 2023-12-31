import { HashCompare } from '@/domain/chat/application/cryptography/hash-compare'
import { HashGenerator } from '@/domain/chat/application/cryptography/hash-generator'

export class FakeHashService implements HashGenerator, HashCompare {
  async hash(plain: string): Promise<string> {
    return plain.concat('-hashed')
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return plain.concat('-hashed') === hash
  }
}
