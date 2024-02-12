import { Avatar as _Avatar } from './avatar'
import { AvatarFallback } from './fallback'
import { AvatarImage } from './image'

export const Avatar = Object.assign(
  {},
  {
    Root: _Avatar,
    Image: AvatarImage,
    Fallback: AvatarFallback,
  },
)

export type { AvatarProps } from './avatar'
export type { AvatarFallbackProps } from './fallback'
export type { AvatarImageProps } from './image'

