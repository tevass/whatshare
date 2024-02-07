import { Avatar as Root } from './root'
import { AvatarFallback } from './fallback'
import { AvatarImage } from './image'

export const Avatar = Object.assign(Root, {
  Image: AvatarImage,
  Fallback: AvatarFallback,
})

export type { AvatarProps } from './root'
export type { AvatarFallbackProps } from './fallback'
export type { AvatarImageProps } from './image'
