'use client'

import { useBoolean } from '@/hooks/use-boolean'
import { Eye, EyeOff, Lock } from 'lucide-react'
import { forwardRef } from 'react'

import { Button } from '@/components/ui/button'
import { Input, type InputProps } from '@/components/ui/input'
import { InputGroup } from '@/components/ui/input-group'

import { cn } from '@/utils/cn'

type InputPasswordRef = HTMLInputElement

export type InputPasswordProps = InputProps

export const InputPassword = forwardRef<InputPasswordRef, InputPasswordProps>(
  ({ className, type, ...props }, ref) => {
    const [showPassword, toggleShowPassword] = useBoolean()
    const handleShowPassword = () => toggleShowPassword()

    const IconEye = showPassword ? EyeOff : Eye

    return (
      <InputGroup.Root>
        <InputGroup.LeftElement>
          <Lock className="size-4" />
        </InputGroup.LeftElement>

        <Input
          ref={ref}
          className={cn('ps-9 pe-9', className)}
          {...props}
          type={showPassword ? 'text' : type}
        />

        <InputGroup.RightElement className="right-0.5">
          <Button
            type="button"
            variant="transparent"
            size="icon"
            onClick={handleShowPassword}
            className="size-9"
          >
            <IconEye className="size-4" />
          </Button>
        </InputGroup.RightElement>
      </InputGroup.Root>
    )
  },
)
InputPassword.displayName = 'InputPassword'
