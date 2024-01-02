import {
  Uploader,
  UploaderRemoveParams,
  UploaderUploadParams,
} from '@/domain/chat/application/storage/uploader'
import { MimeType } from '@/domain/chat/enterprise/entities/value-objects/mime-type'
import { randomUUID } from 'node:crypto'

interface Upload {
  url: string
  fileName: string
  mimetype: MimeType
}

export class FakeUploader implements Uploader {
  public uploads: Upload[] = []

  async upload({
    fileName,
    mimetype,
  }: UploaderUploadParams): Promise<{ url: string }> {
    const url = randomUUID()

    this.uploads.push({
      fileName,
      url,
      mimetype,
    })

    return { url }
  }

  async remove({ url }: UploaderRemoveParams): Promise<void> {
    this.uploads = this.uploads.filter((upload) => upload.url !== url)
  }
}
