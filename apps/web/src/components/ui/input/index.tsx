import { InputGroup } from './group'
import { InputLeftElement } from './left-element'
import { InputRightElement } from './right-element'
import { Input as Root } from './root'

export const Input = Object.assign(
  {},
  {
    Root,
    Group: InputGroup,
    LeftElement: InputLeftElement,
    RightElement: InputRightElement,
  },
)

export type { InputGroupProps } from './group'
export type { InputLeftElementProps } from './left-element'
export type { InputRightElementProps } from './right-element'
export type { InputProps } from './root'

