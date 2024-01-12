export interface EncryptOptions {
  expiresIn?: number
}

export abstract class Encrypter {
  abstract encrypt(
    payload: Record<string, unknown>,
    opts?: EncryptOptions,
  ): Promise<string>
}
