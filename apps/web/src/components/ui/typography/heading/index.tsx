import { HeadingH1 } from './h1'
import { HeadingH2 } from './h2'
import { HeadingH3 } from './h3'
import { HeadingH4 } from './h4'

export const Heading = Object.assign(
  {},
  {
    H1: HeadingH1,
    H2: HeadingH2,
    H3: HeadingH3,
    H4: HeadingH4,
  },
)

export type { HeadingH1Props } from './h1'
export type { HeadingH2Props } from './h2'
export type { HeadingH3Props } from './h3'
export type { HeadingH4Props } from './h4'
