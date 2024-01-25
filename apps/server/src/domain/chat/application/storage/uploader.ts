import { Readable } from 'node:stream'
import { MimeType } from '../../enterprise/entities/value-objects/mime-type'

export interface UploaderUploadParams {
  fileName: string
  mimetype: MimeType
  body: Readable
}

export interface UploaderRemoveParams {
  key: string
}

export abstract class Uploader {
  abstract upload(params: UploaderUploadParams): Promise<{ url: string }>
  abstract remove(params: UploaderRemoveParams): Promise<void>
}
