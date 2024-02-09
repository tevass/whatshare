import { AvatarFallback } from './fallback'
import { AvatarImage } from './image'
import { Avatar as Root } from './root'

export const Avatar = Object.assign(
  {},
  {
    Root,
    Image: AvatarImage,
    Fallback: AvatarFallback,
  },
)

export type { AvatarFallbackProps } from './fallback'
export type { AvatarImageProps } from './image'
export type { AvatarProps } from './root'

