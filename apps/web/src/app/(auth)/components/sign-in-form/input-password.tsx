'use client'

import { Eye, EyeOff, Lock } from 'lucide-react'
import { forwardRef } from 'react'
import { useBoolean } from 'usehooks-ts'

import { IconButton } from '@/components/ui/icon-button'
import { Input, InputProps } from '@/components/ui/input'
import { cn } from '@/utils/cn'

type InputPasswordProps = InputProps

export const InputPassword = forwardRef<HTMLInputElement, InputPasswordProps>(
  ({ className, ...props }, ref) => {
    const { value: showPassword, toggle: toggleShowPassword } = useBoolean()

    const IconEye = showPassword ? EyeOff : Eye

    return (
      <Input.Group>
        <Input.LeftElement>
          <Lock className="w-4 h-4" />
        </Input.LeftElement>

        <Input.Root
          type={showPassword ? 'text' : 'password'}
          ref={ref}
          className={cn('ps-9 pe-9', className)}
          {...props}
        />

        <Input.RightElement className="right-0.5">
          <IconButton
            type="button"
            variant="transparent"
            size="sm"
            onClick={toggleShowPassword}
          >
            <IconEye className="w-4 h-4" />
          </IconButton>
        </Input.RightElement>
      </Input.Group>
    )
  },
)
InputPassword.displayName = 'InputPassword'
