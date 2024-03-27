export interface EncryptOptions {
  expiresIn?: string
}

export abstract class Encrypter {
  abstract encrypt(
    payload: Record<string, unknown>,
    opts?: EncryptOptions,
  ): Promise<string>
}
