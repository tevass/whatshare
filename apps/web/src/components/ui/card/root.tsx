import { Card as _Card } from './card'
import { CardContent } from './content'
import { CardDescription } from './description'
import { CardFooter } from './footer'
import { CardHeader } from './header'
import { CardTitle } from './title'

export const Card = Object.assign(
  {},
  {
    Root: _Card,
    Header: CardHeader,
    Title: CardTitle,
    Description: CardDescription,
    Content: CardContent,
    Footer: CardFooter,
  },
)

export type { CardProps } from './card'
export type { CardContentProps } from './content'
export type { CardDescriptionProps } from './description'
export type { CardFooterProps } from './footer'
export type { CardHeaderProps } from './header'
export type { CardTitleProps } from './title'

