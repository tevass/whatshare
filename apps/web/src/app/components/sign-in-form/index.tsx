'use client'

import { useBoolean } from 'usehooks-ts'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { useZodForm } from '@/hooks/use-zod-form'
import { SignInFormOutput, signInFormSchema } from './schema'
import { Input } from '@/components/ui/input'

import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { IconButton } from '@/components/ui/icon-button'

export function SignInForm() {
  const formProps = useZodForm({
    schema: signInFormSchema,
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const { value: showPassword, toggle: toggleShowPassword } = useBoolean()

  const { control, handleSubmit } = formProps

  function handleSignIn(data: SignInFormOutput) {
    console.log(data)
  }

  return (
    <form
      className="w-[310px] sm:w-96 p-2"
      onSubmit={handleSubmit(handleSignIn)}
    >
      <Form {...formProps}>
        <Card className="pt-4">
          <Card.Content className="space-y-2 pb-3">
            <Form.Field
              control={control}
              name="email"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>E-mail</Form.Label>

                  <Input.Group>
                    <Input.LeftElement>
                      <Mail className="w-4 h-4" />
                    </Input.LeftElement>

                    <Form.Control>
                      <Input type="email" className="ps-8" {...field} />
                    </Form.Control>
                  </Input.Group>

                  <Form.ErrorMessage />
                </Form.Item>
              )}
            />

            <Form.Field
              control={control}
              name="password"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Senha</Form.Label>

                  <Input.Group>
                    <Input.LeftElement>
                      <Lock className="w-4 h-4" />
                    </Input.LeftElement>

                    <Form.Control>
                      <Input
                        type={!showPassword ? 'password' : 'text'}
                        className="ps-8 pe-8"
                        {...field}
                      />
                    </Form.Control>

                    <Input.RightElement className="right-0.5">
                      <IconButton
                        size="sm"
                        variant="transparent"
                        onClick={toggleShowPassword}
                        type="button"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </IconButton>
                    </Input.RightElement>
                  </Input.Group>

                  <Form.ErrorMessage />
                </Form.Item>
              )}
            />
          </Card.Content>

          <Card.Footer>
            <Button type="submit" full>
              ENTRAR
            </Button>
          </Card.Footer>
        </Card>
      </Form>
    </form>
  )
}
