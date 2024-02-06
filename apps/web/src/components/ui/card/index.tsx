import { Card as Root } from './root'
import { CardContent } from './content'
import { CardDescription } from './description'
import { CardFooter } from './footer'
import { CardHeader } from './header'
import { CardTitle } from './title'

export const Card = Object.assign(Root, {
  Content: CardContent,
  Description: CardDescription,
  Footer: CardFooter,
  Header: CardHeader,
  Title: CardTitle,
})

export type { CardProps } from './root'
export type { CardContentProps } from './content'
export type { CardDescriptionProps } from './description'
export type { CardFooterProps } from './footer'
export type { CardHeaderProps } from './header'
export type { CardTitleProps } from './title'
