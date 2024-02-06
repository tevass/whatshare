import { Input as Root } from './root'
import { InputGroup } from './group'
import { InputLeftElement } from './left-element'
import { InputRightElement } from './right-element'

export const Input = Object.assign(Root, {
  Group: InputGroup,
  LeftElement: InputLeftElement,
  RightElement: InputRightElement,
})

export type { InputProps } from './root'
export type { InputGroupProps } from './group'
export type { InputLeftElementProps } from './left-element'
export type { InputRightElementProps } from './right-element'
