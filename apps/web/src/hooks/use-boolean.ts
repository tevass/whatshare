import { useCallback, useState } from 'react'

type UseBooleanToggleFunction = (value?: boolean) => void

type UseBooleanReturn = [boolean, UseBooleanToggleFunction]

export function useBoolean(defaultValue = false): UseBooleanReturn {
  const [value, setValue] = useState(defaultValue)

  const toggle = useCallback((value?: boolean) => {
    if (typeof value !== 'undefined') {
      setValue(value)
    } else {
      setValue((prev) => !prev)
    }
  }, []) as UseBooleanToggleFunction

  return [value, toggle]
}
