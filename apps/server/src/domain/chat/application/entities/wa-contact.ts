import { WAEntity } from '@/core/entities/wa-entity'
import { WAEntityID } from '@/core/entities/wa-entity-id'
import type { SetNonNullable, SetOptional } from 'type-fest'
import * as vCardTS from 'vcard4-tsm'
import { Contact } from '../../enterprise/entities/contact'
import { ContactPhone } from '../../enterprise/entities/value-objects/contact-phone'

export interface WAContactProps {
  name: string | null
  pushName: string | null
  shortName: string | null
  number: string
  formattedNumber: string
  description: string | null
  isGroup: boolean
  isBusiness: boolean
  isEnterprise: boolean
  isMe: boolean
  isMyContact: boolean
  imageUrl: string | null
}

export class WAContact extends WAEntity<WAContactProps, WAEntityID> {
  get name() {
    return this.props.name
  }

  get pushName() {
    return this.props.pushName
  }

  get shortName() {
    return this.props.shortName
  }

  get defaultName() {
    const checkNames = [this.name, this.shortName, this.pushName]

    const validName = checkNames.find((name) => !!name?.trim())
    if (validName) return validName

    return this.formattedNumber
  }

  get number() {
    return this.props.number
  }

  get formattedNumber() {
    return this.props.formattedNumber
  }

  get description() {
    return this.props.description
  }

  get isGroup() {
    return this.props.isGroup
  }

  get isBusiness() {
    return this.props.isBusiness
  }

  get isEnterprise() {
    return this.props.isEnterprise
  }

  get isMe() {
    return this.props.isMe
  }

  get isMyContact() {
    return this.props.isMyContact
  }

  get imageUrl() {
    return this.props.imageUrl
  }

  toContact() {
    return Contact.create({
      name: this.defaultName,
      phone: ContactPhone.create({
        formattedNumber: this.formattedNumber,
        number: this.number,
      }),
      waContactId: this.id,
      imageUrl: this.imageUrl,
      isBusiness: this.isBusiness,
      isEnterprise: this.isEnterprise,
      isGroup: this.isGroup,
      isMyContact: this.isMyContact,
      isWAClient: this.isMe,
    })
  }

  static createFromVCard(vcf: string) {
    const card = vCardTS.parseVCards(vcf)

    const vCard = (card.vCards as vCardTS.VCard4[])[0] as SetNonNullable<
      vCardTS.VCard4,
      'x' | 'N' | 'TEL'
    >

    const businessName = vCard.x?.X_WA_BIZ_NAME?.[0]?.value
    const description = vCard.x?.X_WA_BIZ_DESCRIPTION?.[0]?.value ?? null
    const name = (businessName ||
      vCard.N?.value.givenNames[0] ||
      vCard.FN[0].value) as string

    const number = vCard.TEL?.[0].parameters?.x?.WAID?.[0] as string
    const formattedNumber = vCard.TEL?.[0].value as string

    const isBusinessOrEnterprise =
      !!businessName?.trim() || !!description?.trim()

    const waContactId = new WAEntityID({
      ref: number,
    })

    return new WAContact(
      {
        name,
        number,
        formattedNumber,
        pushName: name,
        shortName: name,
        imageUrl: null,
        isGroup: false,
        isBusiness: isBusinessOrEnterprise,
        isEnterprise: isBusinessOrEnterprise,
        isMyContact: false,
        description,
        isMe: false,
      },
      waContactId,
    )
  }

  static create(
    props: SetOptional<
      WAContactProps,
      'name' | 'shortName' | 'pushName' | 'imageUrl' | 'description' | 'isMe'
    >,
    id: WAEntityID,
  ) {
    return new WAContact(
      {
        ...props,
        name: props.name ?? null,
        shortName: props.shortName ?? null,
        pushName: props.pushName ?? null,
        imageUrl: props.imageUrl ?? null,
        description: props.description ?? null,
        isMe: props.isMe ?? false,
      },
      id,
    )
  }
}
