import { faker } from '@faker-js/faker'
import { MimeType } from '../mime-type'

describe('MimeType', () => {
  test('ext', () => {
    const mimetype = MimeType.create('text/plain')

    expect(mimetype.extension()).toBe('txt')
  })

  test('toString', () => {
    const mimetype = MimeType.create('text/plain')

    expect(mimetype.toString()).toBe('text/plain')
  })

  test('create', () => {
    const mimetype = MimeType.create(faker.system.mimeType())

    expect(mimetype).toBeTruthy()
  })

  test('createFromFilename', () => {
    const mimetype = MimeType.createFromFilename(faker.system.fileName())

    expect(mimetype).toBeTruthy()
  })
})
