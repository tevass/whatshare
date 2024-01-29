import {
  Uploader,
  UploaderRemoveManyParams,
  UploaderRemoveParams,
  UploaderUploadParams,
} from '@/domain/chat/application/storage/uploader'
import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { Injectable } from '@nestjs/common'
import { randomUUID } from 'node:crypto'
import { EnvService } from '../env/env.service'

@Injectable()
export class R2Storage implements Uploader {
  private client: S3Client
  private BUCKET_NAME: string

  constructor(private env: EnvService) {
    this.BUCKET_NAME = this.env.get('AWS_BUCKET_NAME')

    const ACCOUNT_ID = this.env.get('CLOUDFLARE_ACCOUNT_ID')

    this.client = new S3Client({
      endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
      region: 'auto',
      credentials: {
        accessKeyId: env.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: env.get('AWS_SECRET_ACCESS_KEY'),
      },
    })
  }

  async upload(params: UploaderUploadParams): Promise<{ url: string }> {
    const { body, fileName, mimetype } = params

    const uploadId = randomUUID()
    const uniqueFileName = `${uploadId}-${fileName}`

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.BUCKET_NAME,
        Key: uniqueFileName,
        ContentType: mimetype.toString(),
        Body: body,
      }),
    )

    return {
      url: uniqueFileName,
    }
  }

  async remove(params: UploaderRemoveParams): Promise<void> {
    const { key } = params

    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.BUCKET_NAME,
        Key: key,
      }),
    )
  }

  async removeMany(params: UploaderRemoveManyParams): Promise<void> {
    const { keys } = params

    await this.client.send(
      new DeleteObjectsCommand({
        Bucket: this.BUCKET_NAME,
        Delete: {
          Objects: keys.map((key) => ({ Key: key })),
        },
      }),
    )
  }
}
