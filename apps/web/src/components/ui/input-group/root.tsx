import { InputGroup as _InputGroup } from './input-group'
import { InputLeftElement } from './left-element'
import { InputRightElement } from './right-element'

export const InputGroup = Object.assign(
  {},
  {
    Root: _InputGroup,
    LeftElement: InputLeftElement,
    RightElement: InputRightElement,
  },
)

export type { InputGroupProps } from './input-group'
export type { InputLeftElementProps } from './left-element'
export type { InputRightElementProps } from './right-element'

